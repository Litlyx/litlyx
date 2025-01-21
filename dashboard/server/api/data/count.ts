
import { Redis } from "~/server/services/CacheService";
import { getRequestDataOld } from "~/server/utils/getRequestData";

export default defineEventHandler(async event => {


    const data = await getRequestDataOld(event, { requireSchema: true });
    if (!data) return;

    const { schemaName, pid, from, to, model, project_id } = data;

    const cacheKey = `count:${schemaName}:${pid}:${from}:${to}`;
    const cacheExp = 60;

    return await Redis.useCacheV2(cacheKey, cacheExp, async () => {

        const result = await model.aggregate([
            {
                $match: {
                    project_id,
                    created_at: { $gte: new Date(from), $lte: new Date(to) }
                }
            },
            { $count: 'count' },
        ]);

        return result;

    });

});