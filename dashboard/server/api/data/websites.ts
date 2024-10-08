
import { VisitModel } from "@schema/metrics/VisitSchema";
import { Redis } from "~/server/services/CacheService";
import { getRequestData } from "~/server/utils/getRequestData";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, { requireSchema: false });
    if (!data) return;

    const { pid, from, to, project_id, limit } = data;

    const cacheKey = `websites:${pid}:${limit}:${from}:${to}`;
    const cacheExp = 60;

    return await Redis.useCacheV2(cacheKey, cacheExp, async () => {

        const result = await VisitModel.aggregate([
            {
                $match: {
                    project_id,
                    created_at: { $gte: new Date(from), $lte: new Date(to) }
                }
            },
            { $group: { _id: "$website", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: limit }
        ]);

        return result as { _id: string, count: number }[];

    });

});