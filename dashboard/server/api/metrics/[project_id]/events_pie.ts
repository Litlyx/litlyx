
import { EventModel } from "@schema/metrics/EventSchema";
import { ProjectModel } from "@schema/ProjectSchema";
import { Redis, TIMELINE_EXPIRE_TIME } from "~/server/services/CacheService";

export type EventsPie = {
    _id: string,
    count: number
}

export default defineEventHandler(async event => {

    const user = getRequestUser(event);
    if (!user?.logged) return;
    const project_id = getRequestProjectId(event);
    if (!project_id) return;
    const project = await ProjectModel.findOne({ _id: project_id, owner: user.id });
    if (!project) return;


    return await Redis.useCache({
        key: `events_pie${project_id}`,
        exp: TIMELINE_EXPIRE_TIME
    }, async () => {

        const eventsPie: EventsPie[] = await EventModel.aggregate([
            { $match: { project_id: project._id } },
            { $group: { _id: "$name", count: { $sum: 1 } } }
        ]);

        return eventsPie as EventsPie[];
    });



});