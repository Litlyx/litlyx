
import { ProjectCountModel } from "@schema/ProjectsCounts";
import { EventModel } from "@schema/metrics/EventSchema";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";

export default defineEventHandler(async event => {
    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const { project_id } = getQuery(event);
    if (!project_id) return setResponseStatus(event, 400, 'ProjectId is required');

    const events = await EventModel.countDocuments({ project_id });
    const visits = await VisitModel.countDocuments({ project_id });
    const sessions = await SessionModel.countDocuments({ project_id });

    await ProjectCountModel.updateOne({ project_id, events, visits, sessions }, {}, { upsert: true });

    return { ok: true };
});