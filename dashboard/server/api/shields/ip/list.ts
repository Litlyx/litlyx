import { AddressBlacklistModel } from "~/shared/schema/shields/AddressBlacklistSchema";

export default defineEventHandler(async event => {
    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;
    const blacklist = await AddressBlacklistModel.find({ project_id: data.project_id });
    return blacklist.map(e => e.toJSON());
});