import { getTimeline } from "./generic";
import { Redis, TIMELINE_EXPIRE_TIME } from "~/server/services/CacheService";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { executeAdvancedTimelineAggregation, executeTimelineAggregation, fillAndMergeTimelineAggregation } from "~/server/services/TimelineService";

export default defineEventHandler(async event => {
    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    // const { slice, duration } = await readBody(event);

    // return await Redis.useCache({ key: `timeline:sessions_duration:${project_id}:${slice}`, exp: TIMELINE_EXPIRE_TIME }, async () => {
    //     const timelineSessionsDuration = await getTimeline(SessionModel, project_id, slice, duration,
    // {},
    //         { duration: { $sum: '$duration' } },
    //         { count: { $divide: ["$duration", "$count"] } }
    //     );
    //     return timelineSessionsDuration;
    // });


    const { slice, from, to } = await readBody(event);

    if (!from) return setResponseStatus(event, 400, 'from is required');
    if (!from) return setResponseStatus(event, 400, 'to is required');
    if (!from) return setResponseStatus(event, 400, 'slice is required');

    return await Redis.useCache({
        key: `timeline:sessions_duration:${project_id}:${slice}:${from || 'none'}:${to || 'none'}`,
        exp: TIMELINE_EXPIRE_TIME
    }, async () => {
        const timelineData = await executeAdvancedTimelineAggregation({
            projectId: project._id,
            model: SessionModel,
            from, to, slice,
            customGroup: {
                duration: { $sum: '$duration' }
            },
            customProjection: {
                count: { $divide: ["$duration", "$count"] }
            },
        });
        const timelineFilledMerged = fillAndMergeTimelineAggregation(timelineData, slice);
        return timelineFilledMerged;
    });




});