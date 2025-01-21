import { AppsumoCodeTryModel } from "@schema/appsumo/AppsumoCodeTrySchema";

export default defineEventHandler(async event => {

    const data = await getRequestDataOld(event, { requireSchema: false, allowGuests: false, allowLitlyx: false });
    if (!data) return;

    const { pid } = data;

    const tryRes = await AppsumoCodeTryModel.findOne({ project_id: pid }, { valid_codes: 1 });
    if (!tryRes) return { count: 0 }
    return { count: tryRes.valid_codes.length }

});