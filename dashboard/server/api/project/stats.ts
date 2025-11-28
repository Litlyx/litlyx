import { ProjectModel, TProject } from "@schema/project/ProjectSchema";
import { executeAdvancedTimelineAggregation } from "~/server/services/TimelineService";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event);
    const { user_id } = ctx;

    const { pid } = getQuery(event);

    const project = await ProjectModel.findOne({ _id: pid, owner: user_id });
    if (!project) return;

    const timelineData = await executeAdvancedTimelineAggregation({
        projectId: project._id,
        model: VisitModel,
        from: Date.now() - 1000 * 60 * 60 * 24,
        to: Date.now(),
        slice: 'hour'
    });

    const labels = timelineData.map(e => e.timestamp);
    const data = timelineData.map(e => e.count);

    return { chart: { labels, data } };

});