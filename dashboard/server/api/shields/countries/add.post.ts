import { CountryBlacklistModel } from "~/shared/schema/shields/CountryBlacklistSchema";

export default defineEventHandler(async event => {
    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;
    const body = await readBody(event);
    const { country, description } = body;
    if (country.trim().length == 0) return setResponseStatus(event, 400, 'Country is required');
    const result = await CountryBlacklistModel.updateOne({ project_id: data.project_id, country }, { description }, { upsert: true });
    return { ok: result.acknowledged };
});