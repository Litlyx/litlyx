import { DomainWhitelistModel } from "~/shared/schema/shields/DomainWhitelistSchema";

export default defineEventHandler(async event => {
    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;
    const whitelist = await DomainWhitelistModel.findOne({ project_id: data.project_id });
    if (!whitelist) return [];
    const domains = whitelist.domains;
    return domains;
});