import { AddressBlacklistModel } from "~/shared/schema/shields/AddressBlacklistSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');

    const { project_id } = ctx;

    const blacklist = await AddressBlacklistModel.find({ project_id: project_id });

    return blacklist.map(e => e.toJSON());
});