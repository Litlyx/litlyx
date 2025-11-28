
import { durationController } from "~/server/controllers/DurationController";
import { Redis } from "~/server/services/CacheService";
export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'domain', 'range', 'slice', 'permission:webAnalytics', 'flag:allowShare');

    const { pid, project_id, domain, from, to, slice } = ctx;

    const cacheKey = `timeline:sessions_duration:${pid}:${slice}:${from}:${to}:${domain}`;
    const cacheExp = 60;

    if (getHeader(event, 'x-dev') === 'true') await Redis.del(cacheKey);

    return await Redis.useCache(cacheKey, cacheExp, async () => {
        const { data, time } = await durationController.executeDynamic({ project_id: project_id.toString(), from, to, slice, domain });
        setHeader(event, 'x-time', time.toFixed());
        return data;
    });




});