import { EventModel } from "~/shared/schema/metrics/EventSchema";


export default defineEventHandler(async event => {

    const { event_name } = getQuery(event);

    if (!event_name || typeof event_name !== 'string') throw createError({ status: 400, message: 'event_name is required' });

    const ctx = await getRequestContext(event, 'pid', 'domain', 'range', 'permission:webAnalytics');
    const { project_id, domain, from, to } = ctx;

      const websiteMatch = domain ? { website: domain } : {};

    const aggregation = [
        {
            $match: {
                project_id,
                created_at: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                },
                name: event_name,
                ...websiteMatch
            }
        },
        {
            $project: {
                _id: "$name",
                flowHash: 1
            }
        },
        {
            $lookup: {
                from: "visits",
                let: {
                    flowHash: "$flowHash"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            "$project_id", project_id
                                        ]
                                    },
                                    {
                                        $eq: ["$flowHash", "$$flowHash"]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            referrer: 1
                        }
                    }
                ],
                as: "visitInfo"
            }
        },
        {
            $unwind: "$visitInfo"
        },
        {
            $group: {
                _id: "$visitInfo.referrer",
                count: {
                    $sum: 1
                }
            }
        }
    ]



    const result = await EventModel.aggregate(aggregation);

    return result as { _id: string, count: number }[];

});
