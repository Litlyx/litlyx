
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { ApiSettingsModel, TApiSettings } from "@schema/ApiSettingsSchema";
import { ProjectModel } from "@schema/project/ProjectSchema";

import crypto from 'crypto';

function generateApiKey() {
    return 'lit_' + crypto.randomBytes(6).toString('hex');
}

export default defineEventHandler(async event => {

    const body = await readBody(event);

    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;

    if (!body.name) return setResponseStatus(event, 400, 'body is required');
    if (body.name.trim().length == 0) return setResponseStatus(event, 400, 'name is required');
    if (body.name.trim().length < 3) return setResponseStatus(event, 400, 'name too short');
    if (body.name.trim().length > 32) return setResponseStatus(event, 400, 'name too long');

    const { project_id } = data;


    const sameName = await ApiSettingsModel.exists({ project_id, apiName: body.name.trim() });
    if (sameName) return setResponseStatus(event, 400, 'An api key with the same name exists');


    const key = generateApiKey();

    const keyNumbers = await ApiSettingsModel.countDocuments({ project_id });

    if (keyNumbers >= 5) return setResponseStatus(event, 400, 'Api key limit reached');

    const newApiSettings = await ApiSettingsModel.create({ project_id, apiKey: key, apiName: body.name.trim(), created_at: Date.now(), usage: 0 });

    return newApiSettings.toJSON();

});