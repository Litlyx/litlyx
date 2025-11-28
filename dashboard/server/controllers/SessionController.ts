import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import { executeAdvancedTimelineAggregation } from "../services/TimelineService";
import { Types } from "mongoose";
import { StandardController, TimelineOptions } from "./UtilsController";


class SessionController extends StandardController {
    constructor() { super('session', e => e.count); }

    async getTimeline(options: TimelineOptions): Promise<any[]> {
        const { project_id, from, to, slice, domain } = options;

        const timelineData = await executeAdvancedTimelineAggregation({
            projectId: new Types.ObjectId(project_id),
            model: VisitModel,
            from, to, slice, domain,
            allowDisk: true,
            customIdGroup: { session: '$session' },
            customQueries: [
                {
                    index: 2,
                    query: {
                        $group: { _id: { date: '$_id.date' }, count: { $sum: 1 } }
                    }
                }
            ],
            forced: options.ignoreSliceSize,
        });


        return timelineData;


    }
}

export const sessionController = new SessionController();
