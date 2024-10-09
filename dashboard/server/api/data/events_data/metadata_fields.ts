
import { EventModel } from "@schema/metrics/EventSchema";
import {  Redis } from "~/server/services/CacheService";


export default defineEventHandler(async event => {

    const data = await getRequestData(event);
    if (!data) return;

    const { project_id } = data;

    const { name: eventName } = getQuery(event);
    if (!eventName) return [];

    const fields: string[] = await Redis.useCache({
        key: `metadata_fields:${project_id}:${eventName}`,
        exp: 60
    }, async () => {
        const eventsWithName = await EventModel.find({ project_id, name: eventName }, { metadata: 1 }, { limit: 10, sort: { created_at: -1 } });
        const allMetadata = eventsWithName.map(e => e.metadata);
        const allFields = new Set<string>();
        for (const metadata of allMetadata) {
            const keys = Object.keys(metadata || {});
            keys.forEach(key => allFields.add(key));
        }
        return Array.from(allFields.values());
    });

    return fields;

});