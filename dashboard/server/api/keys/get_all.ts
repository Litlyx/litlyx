
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { ApiSettingsModel, TApiSettings } from "@schema/ApiSettingsSchema";
import { UserSettingsModel } from "@schema/UserSettings";
import { ProjectModel } from "@schema/ProjectSchema";


function cryptApiKeyName(apiSettings: TApiSettings): TApiSettings {
    return { ...apiSettings, apiKey: apiSettings.apiKey.substring(0, 6) + '******' }
}

export default defineEventHandler(async event => {

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

    const apiKeys = await ApiSettingsModel.find({ project_id }, { project_id: 0 })

    return apiKeys.map(e => cryptApiKeyName(e.toJSON())) as TApiSettings[];

});