
import { ProjectLimitModel } from "@schema/ProjectsLimits";
import { MAX_LOG_LIMIT_PERCENT } from '@data/broker/Limits';

export default defineEventHandler(async event => {



    const data = await getRequestData(event);
    if (!data) return;

    const { project_id } = data;

    const projectLimits = await ProjectLimitModel.findOne({ project_id });
    if (!projectLimits) return;

    const TOTAL_COUNT = projectLimits.events + projectLimits.visits;
    const COUNT_LIMIT = projectLimits.limit;

    return {
        total: TOTAL_COUNT,
        limit: COUNT_LIMIT,
        maxLimit: Math.round(COUNT_LIMIT * MAX_LOG_LIMIT_PERCENT),
        limited: TOTAL_COUNT > COUNT_LIMIT * MAX_LOG_LIMIT_PERCENT,
        percent: Math.round(100 / COUNT_LIMIT * TOTAL_COUNT)
    }


});