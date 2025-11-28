
import { Types } from "mongoose";
import { AiPlugin, getFirstAvailableSliceFromDates } from "../Plugin";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import { prepareTimelineAggregation } from "../../TimelineService";

const getBouncingRatePlugin = new AiPlugin<'getBouncingRate', ['from', 'to', 'domain', 'limit']>('getBouncingRate',
    {
        type: 'function',
        function: {
            name: 'getBouncingRate',
            description: 'Gets an array of bouncing rate in the user website on a date range.',
            parameters: {
                type: 'object',
                properties: {
                    from: { type: 'string', description: 'ISO string of start date' },
                    to: { type: 'string', description: 'ISO string of end date' },
                    domain: { type: 'string', description: 'Used only to filter a specific webdomain/website' },
                    limit: { type: 'number', description: 'Max number of items to return' }
                },
                required: ['from', 'to']
            }
        }
    },
    async (data) => {

        const info = prepareTimelineAggregation({
            model: VisitModel,
            projectId: new Types.ObjectId(data.project_id),
            from: new Date(data.from).getTime(),
            to: new Date(data.to).getTime(),
            slice: getFirstAvailableSliceFromDates(data.from, data.to),
            domain: data.domain,
        });

        const aggregation = [
            {
                $match: {
                    project_id: new Types.ObjectId(data.project_id),
                    created_at: {
                        $gte: new Date(data.from),
                        $lte: new Date(data.to)
                    },
                    ...info.domainMatch,
                }
            },
            {
                $project: {
                    created_at: 1, session: 1
                }
            },
            {
                $addFields: {
                    date: {
                        $dateTrunc: {
                            date: "$created_at",
                            unit: info.granularity,
                            timezone: "UTC"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        date: "$date",
                        session: "$session"
                    },
                    pageViews: {
                        $sum: 1
                    }
                }
            },
            {
                $group: {
                    _id: {
                        date: "$_id.date"
                    },
                    totalSessions: {
                        $sum: 1
                    },
                    bouncedSessions: {
                        $sum: { $cond: [{ $eq: ["$pageViews", 1] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    totalSessions: 1,
                    bouncedSessions: 1,
                    bounceRate: {
                        $cond: [{ $eq: ["$totalSessions", 0] }, 0,
                        {
                            $multiply: [
                                {
                                    $divide: [
                                        "$bouncedSessions",
                                        "$totalSessions"
                                    ]
                                },
                                100
                            ]
                        }
                        ]
                    }
                }
            },
            {
                $densify: {
                    field: "_id.date",
                    range: {
                        step: 1,
                        unit: info.granularity,
                        bounds: [
                            info.from,
                            info.to
                        ]
                    }
                }
            },
            {
                $addFields: {
                    timestamp: {
                        $toLong: "$_id.date"
                    }
                }
            },
            {
                $set: {
                    count: {
                        $ifNull: ["$bounceRate", 0]
                    }
                }
            },
            {
                $sort: {
                    "_id.date": 1
                }
            },
            {
                $project: { _id: 1, count: 1, timestamp: 1 }
            }
        ] as any[];
        const result = await VisitModel.aggregate(aggregation, { allowDiskUse: true });
        return result;
    }
);


export const bouncingRatePlugins = [
    getBouncingRatePlugin
]