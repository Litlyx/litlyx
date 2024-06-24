import { getTimeline } from "./generic";
import { VisitModel } from "@schema/metrics/VisitSchema";
import DateService from "@services/DateService";
import { Redis, TIMELINE_EXPIRE_TIME } from "~/server/services/CacheService";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { executeAdvancedTimelineAggregation, fillAndMergeTimelineAggregation } from "~/server/services/TimelineService";

export default defineEventHandler(async event => {
    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const { slice, from, to, referrer } = await readBody(event);

    if (!from) return setResponseStatus(event, 400, 'from is required');
    if (!from) return setResponseStatus(event, 400, 'to is required');
    if (!from) return setResponseStatus(event, 400, 'slice is required');

    return await Redis.useCache({
        key: `timeline:referrers:${referrer}:${project_id}:${slice}:${from || 'none'}:${to || 'none'}`,
        exp: TIMELINE_EXPIRE_TIME
    }, async () => {
        const timelineData = await executeAdvancedTimelineAggregation({
            projectId: project._id,
            model: VisitModel,
            from, to, slice,
            customMatch: {
                referrer
            }
        });
        const timelineFilledMerged = fillAndMergeTimelineAggregation(timelineData, slice);
        return timelineFilledMerged;
    });


});