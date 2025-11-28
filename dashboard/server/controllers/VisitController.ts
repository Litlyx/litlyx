import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import { executeAdvancedTimelineAggregation } from "../services/TimelineService";
import { Types } from "mongoose";
import { StandardController, TimelineOptions } from "./UtilsController";


class VisitController extends StandardController {
    constructor() { super('visit', e => e.count); }

    async getTimeline(options: TimelineOptions): Promise<any[]> {
        const { project_id, from, to, slice, domain } = options;
        const timelineData = await executeAdvancedTimelineAggregation({
            projectId: new Types.ObjectId(project_id),
            model: VisitModel,
            from, to, slice, domain,
            forced: options.ignoreSliceSize
        });
        return timelineData;
    }

}

export const visitController = new VisitController();
