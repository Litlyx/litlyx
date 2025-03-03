
import { EventModel } from "@schema/metrics/EventSchema";
import { Redis } from "~/server/services/CacheService";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, ['DOMAIN', 'RANGE'], ['EVENTS']);
    if (!data) return;

    const { pid, from, to, project_id, limit, domain } = data;

    const cacheKey = `events:${pid}:${limit}:${from}:${to}:${domain}`;
    const cacheExp = 20;

    return await Redis.useCacheV2(cacheKey, cacheExp, async () => {

        const result = await EventModel.aggregate([
            {
                $match: {
                    project_id,
                    created_at: { $gte: new Date(from), $lte: new Date(to) },
                    website: domain
                }
            },
            { $group: { _id: "$name", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: limit }
        ]);

        return result as { _id: string, count: number }[];

    });

});