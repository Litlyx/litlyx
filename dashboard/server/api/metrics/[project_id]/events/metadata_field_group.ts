
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

    const { name: eventName, field, from, to } = getQuery(event);

    if (!from) return setResponseStatus(event, 400, 'from is required');
    if (!to) return setResponseStatus(event, 400, 'to is required');
    if (!eventName) return setResponseStatus(event, 400, 'name is required');
    if (!field) return setResponseStatus(event, 400, 'field is required');


    const aggregation: PipelineStage[] = [
        {
            $match: {
                project_id: project._id, name: eventName,
                created_at: {
                    $gte: new Date(from.toString()),
                    $lte: new Date(to.toString()),
                }
            }
        },
        { $group: { _id: `$metadata.${field}`, count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]

    const metadataGrouped = await EventModel.aggregate(aggregation);

    return metadataGrouped;


});