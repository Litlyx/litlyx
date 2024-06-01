
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { ProjectModel } from "@schema/ProjectSchema";
import { EventModel } from "@schema/metrics/EventSchema";

export type CustomEventsAggregated = {
    _id: string,
    count: number
}

export default defineEventHandler(async event => {
    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;


    const websites: CustomEventsAggregated[] = await EventModel.aggregate([
        { $match: { project_id: project._id }, },
        { $group: { _id: "$name", count: { $sum: 1, } } },
        { $sort: { count: -1 } }
    ]);

    return websites;


});