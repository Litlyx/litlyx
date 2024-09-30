import { EventModel } from "@schema/metrics/EventSchema";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { Redis } from "~/server/services/CacheService";

import type { Model } from "mongoose";


const allowedModels: Record<string, { model: Model<any>, field: string }> = {
    'events': {
        model: EventModel,
        field: 'name'
    }
}

type TModelName = keyof typeof allowedModels;

export default defineEventHandler(async event => {
    const project_id = getHeader(event, 'x-pid');
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const from = getRequestHeader(event, 'x-from');
    const to = getRequestHeader(event, 'x-to');

    if (!from || !to) return setResponseStatus(event, 400, 'x-from and x-to are required');

    const schemaName = getRequestHeader(event, 'x-schema');
    if (!schemaName) return setResponseStatus(event, 400, 'x-schema is required');

    if (!Object.keys(allowedModels).includes(schemaName)) return setResponseStatus(event, 400, 'x-schema value is not valid');

    const cacheKey = `count:${schemaName}:${project_id}:${from}:${to}`;
    const cacheExp = 60;

    return await Redis.useCacheV2(cacheKey, cacheExp, async (noStore, updateExp) => {

        const { model } = allowedModels[schemaName as TModelName];

        const result = await model.aggregate([
            {
                $match: {
                    project_id: project._id,
                    created_at: {
                        $gte: new Date(from),
                        $lte: new Date(to)
                    }
                }
            },
            {
                $count: 'total'
            }
        ]);

        return result;

    });

});