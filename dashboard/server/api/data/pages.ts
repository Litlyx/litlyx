
import { VisitModel } from "@schema/metrics/VisitSchema";
import { Redis } from "~/server/services/CacheService";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, ['GUEST', 'RANGE', 'GUEST', 'DOMAIN']);
    if (!data) return;

    const { pid, from, to, project_id, limit, domain } = data;

    const cacheKey = `pages:${pid}:${limit}:${from}:${to}:${domain}`;
    const cacheExp = 60;

    return await Redis.useCacheV2(cacheKey, cacheExp, async () => {

        const result = await VisitModel.aggregate([
            {
                $match: {
                    project_id,
                    created_at: { $gte: new Date(from), $lte: new Date(to) },
                    website: domain
                },
            },
            { $group: { _id: "$page", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: limit }
        ]);

        return result as { _id: string, count: number }[];

    });

});