import { EventModel } from "~/shared/schema/metrics/EventSchema";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'permission:webAnalytics');

    const { project_id } = ctx;

    const hasEvents = await EventModel.exists({ project_id });
    if (hasEvents) return true;
    const hasVisits = await VisitModel.exists({ project_id });
    if (hasVisits) return true;

    return false;

});