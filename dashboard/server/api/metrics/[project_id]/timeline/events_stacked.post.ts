import { EventModel } from "@schema/metrics/EventSchema";
import { getTimeline } from "./generic";
import { Redis, TIMELINE_EXPIRE_TIME } from "~/server/services/CacheService";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { executeAdvancedTimelineAggregation, fillAndMergeTimelineAggregationV2 } from "~/server/services/TimelineService";
import DateService from '@services/DateService';

export default defineEventHandler(async event => {
    const project_id = getRequestProjectId(event);
    if (!project_id) return;
    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;


    const { slice, from, to } = await readBody(event);

    if (!from) return setResponseStatus(event, 400, 'from is required');
    if (!to) return setResponseStatus(event, 400, 'to is required');
    if (!slice) return setResponseStatus(event, 400, 'slice is required');


    return await Redis.useCache({ key: `timeline:events_stacked:${project_id}:${slice}:${from || 'none'}:${to || 'none'}`, exp: TIMELINE_EXPIRE_TIME }, async () => {

        const timelineStackedEvents = await executeAdvancedTimelineAggregation<{ name: String }>({
            model: EventModel,
            projectId: project._id,
            from, to, slice,
            customProjection: { name: "$_id.name" },
            customIdGroup: { name: '$name' },
        })

        return timelineStackedEvents;
    });

});