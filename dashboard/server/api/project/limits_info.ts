import { ProjectModel, TProject } from "@schema/ProjectSchema";
import { ProjectLimitModel } from "@schema/ProjectsLimits";
import { UserSettingsModel } from "@schema/UserSettings";
import { EVENT_LOG_LIMIT_PERCENT } from '@data/broker/Limits';

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const currentActiveProject = await UserSettingsModel.findOne({ user_id: userData.id });
    if (!currentActiveProject) return setResponseStatus(event, 400, 'You need to select a project');

    const project_id = currentActiveProject.active_project_id;

    const project = await ProjectModel.findById(project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');

    const projectLimits = await ProjectLimitModel.findOne({ project_id });
    if (!projectLimits) return;

    const TOTAL_COUNT = projectLimits.events + projectLimits.visits;
    const COUNT_LIMIT = projectLimits.limit;
    
    return {
        total: TOTAL_COUNT,
        limit: COUNT_LIMIT,
        maxLimit: Math.round(COUNT_LIMIT * EVENT_LOG_LIMIT_PERCENT),
        limited: TOTAL_COUNT > COUNT_LIMIT * EVENT_LOG_LIMIT_PERCENT,
        percent: Math.round(100 / COUNT_LIMIT * TOTAL_COUNT)
    }


});