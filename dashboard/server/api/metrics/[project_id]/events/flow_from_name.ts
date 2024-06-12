

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

    const { name: eventName } = getQuery(event);
    if (!eventName) return [];

    const aggregation: PipelineStage[] = [
        { $match: { project_id: project._id, name: eventName } },
        { $group: { _id: "$flowHash", count: { $sum: 1 } } },
        { $match: { _id: { $ne: null } } },
        {
            $lookup: {
                from: "visits",
                let: { flowHash: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$flowHash", "$$flowHash"] } } },
                    { $group: { _id: "referrers", list: { $addToSet: "$referrer" } } },
                    { $limit: 1 }
                ],
                as: "referrers"
            }
        }
    ];

    const flow: { _id: string, count: number, referrers: [{ list: string[] }] }[] = await EventModel.aggregate(aggregation);

    return flow;


});
