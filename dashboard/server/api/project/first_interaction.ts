import { EventModel } from "@schema/metrics/EventSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, {
        requireSchema: false,
        allowLitlyx: false,
        requireSlice: false
    });
    if (!data) return;

    const { project_id } = data;
    const hasEvent = await EventModel.exists({ project_id });
    if (hasEvent) return true;
    const hasVisit = await VisitModel.exists({ project_id });
    if (hasVisit) return true;

    return false;

});