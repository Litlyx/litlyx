
import { ApiSettingsModel } from "@schema/ApiSettingsSchema";

export default defineEventHandler(async event => {

    const body = await readBody(event);

    const data = await getRequestDataOld(event, { allowGuests: false, allowLitlyx: false, });
    if (!data) return;

    const { project_id } = data;

    const deletation = await ApiSettingsModel.deleteOne({ project_id, _id: body.api_id });
    return { ok: deletation.acknowledged };

});