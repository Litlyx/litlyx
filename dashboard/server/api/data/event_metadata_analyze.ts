import { EventModel } from "~/shared/schema/metrics/EventSchema";


export default defineEventHandler(async event => {

    const { event_name, field_name } = getQuery(event);

    if (!event_name || typeof event_name !== 'string') throw createError({ status: 400, message: 'event_name is required' });
    if (!field_name || typeof field_name !== 'string') throw createError({ status: 400, message: 'field_name is required' });

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
        { $group: { _id: `$metadata.${field_name}`, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]

    const result = await EventModel.aggregate(aggregation as any);

    return result as { _id: string, count: number }[]

});
