import { SessionModel } from "@schema/metrics/SessionSchema";
import { Redis } from "~/server/services/CacheService";
import { executeTimelineAggregation } from "~/server/services/TimelineService";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, ['SLICE', 'DOMAIN', 'RANGE', 'OFFSET'], ['WEB']);
    if (!data) return;

    const { pid, from, to, slice, project_id, timeOffset, domain } = data;

    const cacheKey = `timeline:sessions:${pid}:${slice}:${from}:${to}:${domain}`;
    const cacheExp = 60;

    return await Redis.useCacheV2(cacheKey, cacheExp, async () => {
        const timelineData = await executeTimelineAggregation({
            projectId: project_id,
            model: SessionModel,
            from, to, slice, timeOffset, domain
        });
        return timelineData;
    });




});