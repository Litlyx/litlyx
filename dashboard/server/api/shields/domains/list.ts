
import { DomainWhitelistModel } from "~/shared/schema/shields/DomainWhitelistSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');

    const { project_id } = ctx;

    const whitelist = await DomainWhitelistModel.findOne({
        project_id
    });

    if (!whitelist) return [];

    return whitelist.domains;

});