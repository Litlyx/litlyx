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
                ...websiteMatch,
                $expr: { $eq: [{ $type: "$metadata" }, "object"] }
            }
        },
        { $project: { metadataKeys: { $objectToArray: "$metadata" } } },
        { $unwind: "$metadataKeys" },
        { $group: { _id: "result", uniqueFields: { $addToSet: "$metadataKeys.k" } } }
    ]

    const events = await EventModel.aggregate(aggregation);

    if (!events[0]) return [];
    return events[0].uniqueFields as string[];

});
