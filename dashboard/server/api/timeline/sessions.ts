
import { sessionController } from "~/server/controllers/SessionController";
import { Redis } from "~/server/services/CacheService";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'domain', 'range', 'slice', 'permission:webAnalytics', 'flag:allowShare');

    const { pid, project_id, domain, from, to, slice } = ctx;

    const cacheKey = `timeline:sessions:${pid}:${slice}:${from}:${to}:${domain}`;
    const cacheExp = 20;

    if (getHeader(event, 'x-dev') === 'true') await Redis.del(cacheKey);

    return await Redis.useCache(cacheKey, cacheExp, async () => {
        const { data, time } = await sessionController.executeDynamic({ project_id: project_id.toString(), from, to, slice, domain });
        setHeader(event, 'x-time', time.toFixed());
        return data;
    });



});