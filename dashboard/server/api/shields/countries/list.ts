import { CountryBlacklistModel } from "~/shared/schema/shields/CountryBlacklistSchema";

export default defineEventHandler(async event => {
    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;
    const blacklist = await CountryBlacklistModel.find({ project_id: data.project_id });
    return blacklist.map(e => e.toJSON());
});