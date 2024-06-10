import { getTimeline } from "./generic";
import { VisitModel } from "@schema/metrics/VisitSchema";
import { Redis, TIMELINE_EXPIRE_TIME } from "~/server/services/CacheService";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";


export default defineEventHandler(async event => {
    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const { slice, duration, referrer } = await readBody(event);

    // return await Redis.useCache({ key: `timeline:referrers:${project_id}:${slice}`, exp: TIMELINE_EXPIRE_TIME }, async () => {
    const timelineReferrers = await getTimeline(VisitModel, project_id, slice, duration,
        {},
        {},
        { referrer: "$_id.referrer" },
        { referrer: "$referrer" },
        { referrer }
    );
    return timelineReferrers;
    // });



});