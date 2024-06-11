
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { EventModel } from "@schema/metrics/EventSchema";
import { EVENT_NAMES_EXPIRE_TIME, Redis } from "~/server/services/CacheService";


export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);

    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const names: string[] = await Redis.useCache({ key: `event_names:${project_id}`, exp: EVENT_NAMES_EXPIRE_TIME }, async () => {
        const namesAggregation = await EventModel.aggregate([{ $match: { project_id: project._id } }, { $group: { _id: "$name" } }]);
        return namesAggregation.map(e => e._id);
    });

    return names;

});