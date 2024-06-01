import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { EventModel } from "@schema/metrics/EventSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";

export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const hasEvent = await EventModel.exists({ project_id: project._id });
    if (hasEvent) return true;
    const hasVisit = await VisitModel.exists({ project_id: project._id });
    if (hasVisit) return true;

    return false;

});