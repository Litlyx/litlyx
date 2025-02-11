
import { Redis } from "~/server/services/CacheService";

export default defineEventHandler(async event => {


    const data = await getRequestData(event, ['GUEST', 'DOMAIN', 'RANGE', 'SCHEMA']);
    if (!data) return;

    const { schemaName, pid, from, to, model, project_id, domain } = data;

    const cacheKey = `count:${schemaName}:${pid}:${from}:${to}:${domain}`;
    const cacheExp = 20;

    return await Redis.useCacheV2(cacheKey, cacheExp, async () => {

        const result = await model.aggregate([
            {
                $match: {
                    project_id,
                    created_at: { $gte: new Date(from), $lte: new Date(to) },
                    website: domain
                }
            },
            { $count: 'count' },
        ]);

        return result;

    });

});