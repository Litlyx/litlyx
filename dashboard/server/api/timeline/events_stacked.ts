import { EventModel } from "@schema/metrics/EventSchema";
import { Redis, TIMELINE_EXPIRE_TIME } from "~/server/services/CacheService";
import { executeAdvancedTimelineAggregation } from "~/server/services/TimelineService";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, ['GUEST', 'RANGE', 'SLICE', 'DOMAIN']);
    if (!data) return;

    const { from, to, slice, project_id, timeOffset, domain } = data;

    return await Redis.useCache({ key: `timeline:events_stacked:${project_id}:${slice}:${from || 'none'}:${to || 'none'}:${domain}`, exp: TIMELINE_EXPIRE_TIME }, async () => {

        const timelineStackedEvents = await executeAdvancedTimelineAggregation<{ name: String }>({
            model: EventModel,
            projectId: project_id,
            from, to, slice,
            customProjection: { name: "$_id.name" },
            customIdGroup: { name: '$name' },
            timeOffset,
            domain
        })

        return timelineStackedEvents.filter(e => e.name != undefined);
    });

});