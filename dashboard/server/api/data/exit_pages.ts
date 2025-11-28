
import { VisitModel } from "@schema/metrics/VisitSchema";
import { Redis } from "~/server/services/CacheService";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'domain', 'range', 'limit', 'permission:webAnalytics','flag:allowShare');
    const { pid, project_id, domain, from, to, limit } = ctx;

    const cacheKey = `exit_pages:${pid}:${limit}:${from}:${to}:${domain}`;
    const cacheExp = 60;

    return await Redis.useCache(cacheKey, cacheExp, async () => {

        const websiteMatch = domain ? { website: domain } : {};

        const result = await VisitModel.aggregate([
            {
                $match: {
                    project_id,
                    created_at: { $gte: new Date(from), $lte: new Date(to) },
                    ...websiteMatch
                },
            },
            { $sort: { session: 1, created_at: 1 } },
            { $group: { _id: "$session", exitPage: { $last: "$page" } } },
            { $group: { _id: "$exitPage", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit }
        ]);

        return result as { _id: string, count: number }[];

    });

});