
import { VisitModel } from "@schema/metrics/VisitSchema";
import { Redis } from "~/server/services/CacheService";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'domain', 'range', 'limit', 'permission:webAnalytics','flag:allowShare');
    const { pid, project_id, domain, from, to, limit } = ctx;

    const cacheKey = `oss:${pid}:${limit}:${from}:${to}:${domain}`;
    const cacheExp = 60;

    return await Redis.useCache(cacheKey, cacheExp, async () => {

        const websiteMatch = domain ? { website: domain } : {};

        const result = await VisitModel.aggregate([
            {
                $match: {
                    project_id,
                    created_at: { $gte: new Date(from), $lte: new Date(to) },
                    ...websiteMatch
                }
            },
            { $group: { _id: "$os", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: limit }
        ]);

        return result as { _id: string, count: number }[];

    });

});