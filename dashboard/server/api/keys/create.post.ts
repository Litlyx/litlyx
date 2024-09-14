
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { ApiSettingsModel, TApiSettings } from "@schema/ApiSettingsSchema";
import { UserSettingsModel } from "@schema/UserSettings";
import { ProjectModel } from "@schema/ProjectSchema";

import crypto from 'crypto';

function generateApiKey() {
    return 'lit_' + crypto.randomBytes(6).toString('hex');
}

export default defineEventHandler(async event => {

    const body = await readBody(event);

    if (body.name.length == 0) return setResponseStatus(event, 400, 'name is required');

    if (body.name.length < 3) return setResponseStatus(event, 400, 'name too short');
    if (body.name.length > 32) return setResponseStatus(event, 400, 'name too long');

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

    const key = generateApiKey();

    const keyNumbers = await ApiSettingsModel.countDocuments({ project_id });

    if (keyNumbers >= 5) return setResponseStatus(event, 400, 'Api key limit reached');

    const newApiSettings = await ApiSettingsModel.create({ project_id, apiKey: key, apiName: body.name, created_at: Date.now(), usage: 0 });

    return newApiSettings.toJSON();

});