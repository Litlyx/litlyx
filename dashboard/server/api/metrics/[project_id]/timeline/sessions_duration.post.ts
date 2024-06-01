import { getTimeline } from "./generic";
import { Redis, TIMELINE_EXPIRE_TIME } from "~/server/services/CacheService";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { SessionModel } from "@schema/metrics/SessionSchema";

export default defineEventHandler(async event => {
    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const { slice, duration } = await readBody(event);

    return await Redis.useCache({ key: `timeline:sessions_duration:${project_id}:${slice}`, exp: TIMELINE_EXPIRE_TIME }, async () => {
        const timelineSessionsDuration = await getTimeline(SessionModel, project_id, slice, duration, {},
            { duration: { $sum: '$duration' } },
            { count: { $divide: ["$duration", "$count"] } }
        );
        return timelineSessionsDuration;
    });



});