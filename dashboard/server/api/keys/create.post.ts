
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { ApiSettingsModel, TApiSettings } from "@schema/ApiSettingsSchema";
import { ProjectModel } from "@schema/project/ProjectSchema";

import crypto from 'crypto';

function generateApiKey() {
    return 'lit_' + crypto.randomBytes(6).toString('hex');
}

export default defineEventHandler(async event => {

    const body = await readBody(event);

    if (body.name.length == 0) return setResponseStatus(event, 400, 'name is required');

    if (body.name.length < 3) return setResponseStatus(event, 400, 'name too short');
    if (body.name.length > 32) return setResponseStatus(event, 400, 'name too long');

    const data = await getRequestData(event, { allowGuests: false, allowLitlyx: false, });
    if (!data) return;

    const { project_id } = data;
    
    const key = generateApiKey();

    const keyNumbers = await ApiSettingsModel.countDocuments({ project_id });

    if (keyNumbers >= 5) return setResponseStatus(event, 400, 'Api key limit reached');

    const newApiSettings = await ApiSettingsModel.create({ project_id, apiKey: key, apiName: body.name, created_at: Date.now(), usage: 0 });

    return newApiSettings.toJSON();

});