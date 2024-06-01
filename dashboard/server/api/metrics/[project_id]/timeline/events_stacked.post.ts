import { EventModel } from "@schema/metrics/EventSchema";
import { getTimeline } from "./generic";
import { Redis, TIMELINE_EXPIRE_TIME } from "~/server/services/CacheService";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";

export default defineEventHandler(async event => {
    const project_id = getRequestProjectId(event);
    if (!project_id) return;
    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;


    const { slice, duration } = await readBody(event);


    return await Redis.useCache({ key: `timeline:events_stacked:${project_id}:${slice}`, exp: TIMELINE_EXPIRE_TIME }, async () => {
        const timelineStackedEvents = await getTimeline(EventModel, project_id, slice, duration,
            {},
            {},
            { name: "$_id.name" },
            { name: '$name' }
        );
        return timelineStackedEvents;
    });

});