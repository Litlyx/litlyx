import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import { prepareTimelineAggregation } from "../services/TimelineService";
import { Types } from "mongoose";
import { StandardController, TimelineOptions } from "./UtilsController";


class BouncingController extends StandardController {
    constructor() { super('bouncing', e => e.count); }

    async getTimeline(options: TimelineOptions): Promise<any[]> {
        const { project_id, slice, from, to, domain } = options;

        const info = prepareTimelineAggregation({
            model: VisitModel,
            from, to, slice, domain,
            projectId: new Types.ObjectId(project_id),
            forced: options.ignoreSliceSize
        });

        const aggregation = [
            {
                $match: {
                    project_id: new Types.ObjectId(project_id),
                    created_at: {
                        $gte: new Date(from),
                        $lte: new Date(to)
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
                    _id: "$_id.date",
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
                    field: "_id",
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
                $set: {
                    count: {
                        $ifNull: ["$bounceRate", 0]
                    }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            },
            {
                $project: { _id: 1, count: 1, timestamp: 1 }
            }
        ] as any[];

        const result = await VisitModel.aggregate(aggregation, { allowDiskUse: true });

        return result;
    }
}

export const bouncingController = new BouncingController();

