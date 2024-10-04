
import { ApiSettingsModel, TApiSettings } from "@schema/ApiSettingsSchema";

function cryptApiKeyName(apiSettings: TApiSettings): TApiSettings {
    return { ...apiSettings, apiKey: apiSettings.apiKey.substring(0, 6) + '******' }
}

export default defineEventHandler(async event => {

    const data = await getRequestData(event, { allowGuests: false, allowLitlyx: false, requireRange: false });
    if (!data) return;

    const { project_id } = data;

    const apiKeys = await ApiSettingsModel.find({ project_id }, { project_id: 0 })
    return apiKeys.map(e => cryptApiKeyName(e.toJSON())) as TApiSettings[];

});