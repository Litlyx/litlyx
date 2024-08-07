
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { EventModel } from "@schema/metrics/EventSchema";
import { DATA_EXPIRE_TIME, Redis } from "~/server/services/CacheService";

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

    const from = getRequestHeader(event, 'x-from');
    const to = getRequestHeader(event, 'x-to');


    if (!from || !to) return setResponseStatus(event, 400, 'x-from and x-to headers missing');


    return await Redis.useCache({
        key: `events:${project_id}:${from}:${to}`,
        exp: DATA_EXPIRE_TIME
    }, async () => {

        const events: CustomEventsAggregated[] = await EventModel.aggregate([
            {
                $match: {
                    project_id: project._id, created_at: {
                        $gte: new Date(from),
                        $lte: new Date(to)
                    }
                },
            },
            { $group: { _id: "$name", count: { $sum: 1, } } },
            { $sort: { count: -1 } }
        ]);

        return events;
    });



});