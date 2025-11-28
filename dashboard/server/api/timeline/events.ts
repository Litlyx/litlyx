
import { EventModel } from "@schema/metrics/EventSchema";
import { Redis } from "~/server/services/CacheService";
import { executeTimelineAggregation } from "~/server/services/TimelineService";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'domain', 'range', 'slice','permission:webAnalytics', 'flag:allowShare');

    const { pid, project_id, domain, from, to, slice } = ctx;

    const cacheKey = `timeline:events:${pid}:${slice}:${from}:${to}:${domain}`;
    const cacheExp = 60;

    return await Redis.useCache(cacheKey, cacheExp, async () => {
        const timelineData = await executeTimelineAggregation({
            projectId: project_id,
            model: EventModel,
            from, to, slice, domain
        });
        return timelineData;
    });




});