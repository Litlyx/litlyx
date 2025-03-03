import { SessionModel } from "@schema/metrics/SessionSchema";
import { Redis } from "~/server/services/CacheService";
import { executeAdvancedTimelineAggregation, fillAndMergeTimelineAggregationV2 } from "~/server/services/TimelineService";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, ['SLICE', 'DOMAIN', 'RANGE'], ['WEB']);
    if (!data) return;

    const { pid, from, to, slice, project_id, domain } = data;

    const cacheKey = `timeline:sessions_duration:${pid}:${slice}:${from}:${to}:${domain}`;
    const cacheExp = 60;

    return await Redis.useCacheV2(cacheKey, cacheExp, async () => {
        const timelineData = await executeAdvancedTimelineAggregation({
            projectId: project_id,
            model: SessionModel,
            from, to, slice,
            domain,
            customGroup: {
                duration: { $sum: '$duration' }
            },
            customProjection: {
                count: { $divide: ["$duration", "$count"] }
            },
        });
        const timelineFilledMerged = fillAndMergeTimelineAggregationV2(timelineData, slice, from, to);
        return timelineFilledMerged;

    });




});