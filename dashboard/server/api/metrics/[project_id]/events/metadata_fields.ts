
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { EventModel } from "@schema/metrics/EventSchema";
import { EVENT_METADATA_FIELDS_EXPIRE_TIME, Redis } from "~/server/services/CacheService";


export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);

    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const { name: eventName } = getQuery(event);
    if (!eventName) return [];

    const fields: string[] = await Redis.useCache({ key: `metadata_fields:${project_id}:${eventName}`, exp: EVENT_METADATA_FIELDS_EXPIRE_TIME }, async () => {
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