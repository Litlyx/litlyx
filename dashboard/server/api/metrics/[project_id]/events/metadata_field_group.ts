
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { EventModel } from "@schema/metrics/EventSchema";
import { EVENT_METADATA_FIELDS_EXPIRE_TIME, Redis } from "~/server/services/CacheService";
import { PipelineStage } from "mongoose";


export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);

    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const { name: eventName, field } = getQuery(event);
    if (!eventName || !field) return [];

    const aggregation: PipelineStage[] = [
        { $match: { project_id: project._id, name: eventName } },
        { $group: { _id: `$metadata.${field}`, count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]

    const metadataGrouped = await EventModel.aggregate(aggregation);

    return metadataGrouped;


});