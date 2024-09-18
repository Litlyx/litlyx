

import { ProjectLimitModel } from '@schema/ProjectsLimits';
import { MAX_LOG_LIMIT_PERCENT } from '@data/broker/Limits';
import { checkLimitsForEmail } from './EmailController';

export async function checkLimits(project_id: string) {
    const projectLimits = await ProjectLimitModel.findOne({ project_id });
    if (!projectLimits) return false;
    const TOTAL_COUNT = projectLimits.events + projectLimits.visits;
    const COUNT_LIMIT = projectLimits.limit;
    if ((TOTAL_COUNT) > COUNT_LIMIT * MAX_LOG_LIMIT_PERCENT) return false;
    await checkLimitsForEmail(projectLimits);
    return true;
}