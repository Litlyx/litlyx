import { SessionModel } from "@schema/metrics/SessionSchema";
import { Redis } from "~/server/services/CacheService";
import { executeTimelineAggregation, fillAndMergeTimelineAggregationV2 } from "~/server/services/TimelineService";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, { requireSchema: false, requireSlice: true });
    if (!data) return;

    const { pid, from, to, slice, project_id } = data;

    const cacheKey = `timeline:sessions:${pid}:${slice}:${from}:${to}`;
    const cacheExp = 60;

    return await Redis.useCacheV2(cacheKey, cacheExp, async () => {
        const timelineData = await executeTimelineAggregation({
            projectId: project_id,
            model: SessionModel,
            from, to, slice,
        });
        const timelineFilledMerged = fillAndMergeTimelineAggregationV2(timelineData, slice, from, to);
        return timelineFilledMerged;

    });




});