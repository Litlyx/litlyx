
import { EventModel } from "@schema/metrics/EventSchema";
import { Redis } from "~/server/services/CacheService";


export default defineEventHandler(async event => {

    const data = await getRequestDataOld(event, { requireSchema: false });
    if (!data) return;

    const { project_id } = data;

    const names: string[] = await Redis.useCache({
        key: `event_names:${project_id}`,
        exp: 60
    }, async () => {
        const namesAggregation = await EventModel.aggregate([
            { $match: { project_id } },
            { $group: { _id: "$name" } }
        ]);
        return namesAggregation.map(e => e._id);
    });

    return names;

});