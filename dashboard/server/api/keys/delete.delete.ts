
import { ApiSettingsModel } from "@schema/ApiSettingsSchema";
import { UserSettingsModel } from "@schema/UserSettings";
import { ProjectModel } from "@schema/ProjectSchema";

export default defineEventHandler(async event => {

    const body = await readBody(event);

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const currentActiveProject = await UserSettingsModel.findOne({ user_id: userData.id });
    if (!currentActiveProject) return setResponseStatus(event, 400, 'You need to select a project');

    const project_id = currentActiveProject.active_project_id;

    const project = await ProjectModel.findById(project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');

    if (project.owner.toString() != userData.id) {
        return setResponseStatus(event, 400, 'You are not the owner');
    }

    const deletation = await ApiSettingsModel.deleteOne({ _id: body.api_id });
    return { ok: deletation.acknowledged };

});