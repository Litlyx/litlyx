import { Redis } from "~/server/services/CacheService";
import { executeAdvancedTimelineAggregation } from "~/server/services/TimelineService";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'domain', 'range', 'slice', 'permission:webAnalytics');

    const { pid, project_id, domain, from, to, slice } = ctx;

    const cacheKey = `timeline:events:${pid}:${slice}:${from}:${to}:${domain}`;
    const cacheExp = 60;

    return await Redis.useCache(cacheKey, cacheExp, async () => {
        const timelineData = await executeAdvancedTimelineAggregation({
            projectId: project_id,
            model: VisitModel,
            from, to, slice, domain,
            customIdGroup: {
                session: "$session"
            }
        });
        return timelineData;
    });





});