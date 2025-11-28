import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import { prepareTimelineAggregation } from "../services/TimelineService";
import { Types } from "mongoose";
import { StandardController, TimelineOptions } from "./UtilsController";

class DurationController extends StandardController {
    constructor() { super('duration', e => e.count); }

    async getTimeline(options: TimelineOptions): Promise<any[]> {
        const { project_id, from, to, slice, domain } = options;
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
                    _id: 0,
                    session: 1,
                    created_at: 1
                }
            },
            {
                $setWindowFields: {
                    partitionBy: "$session",
                    sortBy: {
                        created_at: 1
                    },
                    output: {
                        prevTime: {
                            $shift: {
                                output: "$created_at",
                                by: -1
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    timeDiff: {
                        $cond: [
                            { $eq: ["$prevTime", null] },
                            0,
                            { $divide: [{ $subtract: ["$created_at", "$prevTime"] }, 1000] }
                        ]
                    },
                    isNewSegment: {
                        $cond: [
                            {
                                $gt: [{ $divide: [{ $subtract: ["$created_at", "$prevTime"] }, 1000] },
                                    300 // 5 minutes = 300 seconds
                                ]
                            }, 1, 0]
                    }
                }
            },
            {
                $setWindowFields: {
                    partitionBy: "$session",
                    sortBy: {
                        created_at: 1
                    },
                    output: {
                        segmentIndex: {
                            $sum: "$isNewSegment",
                            window: {
                                documents: ["unbounded", "current"]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    segmentId: {
                        $concat: [
                            "$session",
                            "_",
                            {
                                $toString: "$segmentIndex"
                            }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$segmentId",
                    session: {
                        $first: "$session"
                    },
                    startTime: {
                        $min: "$created_at"
                    },
                    endTime: {
                        $max: "$created_at"
                    },
                    pageViews: {
                        $sum: 1
                    }
                }
            },
            {
                $addFields: {
                    durationSeconds: {
                        $divide: [
                            {
                                $subtract: ["$endTime", "$startTime"]
                            },
                            1000
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    segmentId: "$_id",
                    session: 1,
                    startTime: 1,
                    endTime: 1,
                    pageViews: 1,
                    durationSeconds: 1
                }
            },
            {
                $addFields: {
                    date: {
                        $dateTrunc: {
                            date: "$startTime",
                            unit: info.granularity,
                            timezone: "UTC"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        date: "$date"
                    },
                    averageDuration: {
                        $avg: "$durationSeconds"
                    },
                    sessionCount: {
                        $sum: 1
                    }
                }
            },
            {
                $densify: {
                    field: "_id.date",
                    range: {
                        step: 1,
                        unit: info.granularity,
                        bounds: [info.from, info.to]
                    }
                }
            },
            { $set: { averageDuration: { $ifNull: ["$averageDuration", 0] } } },
            {
                $sort: {
                    "_id.date": 1
                }
            },
            {
                $project: {
                    _id: "$_id.date",
                    count: {
                        $round: ["$averageDuration", 2]
                    },
                    sessions: "$sessionCount",
                }
            }
        ]

        const result = await VisitModel.aggregate(aggregation as any, { allowDiskUse: true });

        return result;

    }
}

export const durationController = new DurationController();
