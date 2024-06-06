
import { ProjectCountModel } from "@schema/ProjectsCounts";

export default defineEventHandler(async event => {
    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const { project_id } = getQuery(event);
    if (!project_id) return setResponseStatus(event, 400, 'ProjectId is required');

    await ProjectCountModel.updateOne({ project_id, events: 0, visits: 0 }, {}, { upsert: true });

    return { ok: true };
});