import { ProjectModel, TProject } from "@schema/ProjectSchema";
import { ProjectCountModel } from "@schema/ProjectsCounts";
import { UserSettingsModel } from "@schema/UserSettings";

const { BROKER_UPDATE_EXPIRE_TIME_PATH } = useRuntimeConfig();

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const currentActiveProject = await UserSettingsModel.findOne({ user_id: userData.id });
    if (!currentActiveProject) return setResponseStatus(event, 400, 'You need to select a project');

    const project_id = currentActiveProject.active_project_id;

    const project = await ProjectModel.findById(project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');


    let projectCounts = await ProjectCountModel.findOne({ project_id }, {}, {
        sort: { billing_expire_at: -1 }
    });

    if (!projectCounts || Date.now() > new Date(projectCounts.billing_expire_at).getTime()) {
        await fetch(BROKER_UPDATE_EXPIRE_TIME_PATH + project._id.toString());
        projectCounts = await ProjectCountModel.findOne({ project_id }, {}, { sort: { billing_expire_at: -1 } });
    }

    if (!projectCounts) return setResponseStatus(event, 400, 'Project counts not found');

    const result = {
        premium: project.premium,
        premium_type: project.premium_type,
        billing_start_at: projectCounts.billing_start_at,
        billing_expire_at: projectCounts.billing_expire_at,
        limit: projectCounts.limit,
        count: projectCounts.events + projectCounts.visits,
    }

    return result;

});