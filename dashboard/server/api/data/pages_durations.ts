
import { VisitModel } from "@schema/metrics/VisitSchema";
import { Redis } from "~/server/services/CacheService";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'domain', 'range', 'limit', 'permission:webAnalytics', 'flag:allowShare');
    const { pid, project_id, domain, from, to, limit } = ctx;

    const cacheKey = `pages_durations:${pid}:${limit}:${from}:${to}:${domain}`;
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
            {
                $setWindowFields: {
                    partitionBy: "$session",
                    sortBy: { created_at: 1 },
                    output: {
                        nextCreatedAt: { $shift: { output: "$created_at", by: 1 } },
                        nextPage: { $shift: { output: "$page", by: 1 } }
                    }
                }
            },
            {
                $project: {
                    page: 1,
                    created_at: 1,
                    nextCreatedAt: 1,
                    durationMs: {
                        $cond: [
                            { $ne: ["$nextCreatedAt", null] },
                            { $subtract: ["$nextCreatedAt", "$created_at"] },
                            null
                        ]
                    }
                }
            },
            {
                $match: {
                    durationMs: { $ne: null, $gt: 0, $lte: 1000 * 60 * 60 * 1 }
                }
            },
            {
                $group: {
                    _id: "$page",
                    count: { $sum: 1 },
                    avgMs: { $avg: "$durationMs" }
                }
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    avgSeconds: { $round: [{ $divide: ["$avgMs", 1000] }, 0] },
                }
            },
            { $sort: { count: -1 } },
            { $limit: limit },
        ]);

        return result as { _id: string, count: number }[];

    });

});