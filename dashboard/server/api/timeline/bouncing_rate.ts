import { bouncingController } from "~/server/controllers/BouncingController";
import { Redis } from "~/server/services/CacheService";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'domain', 'range', 'slice', 'permission:webAnalytics', 'flag:allowShare');

    const { pid, project_id, domain, from, to, slice } = ctx;

    const cacheKey = `timeline:bouncing_rate:${pid}:${slice}:${from}:${to}`;
    const cacheExp = 60 * 60; //1 hour

    if (getHeader(event, 'x-dev') === 'true') await Redis.del(cacheKey);

    return await Redis.useCache(cacheKey, cacheExp, async () => {
        const { data, time } = await bouncingController.executeDynamic({ project_id: project_id.toString(), from, to, slice, domain });
        setHeader(event, 'x-time', time.toFixed());
        return data;
    });

});