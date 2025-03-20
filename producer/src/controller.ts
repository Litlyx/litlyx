import { DomainWhitelistModel } from "./shared/schema/shields/DomainWhitelistSchema";

export async function isAllowedToLog(project_id: string, website: string) {
    const whitelist = await DomainWhitelistModel.findOne({ project_id }, { website: 1 });
    if (!whitelist) return;
    const allowedDomains = whitelist.domains;
    for (const allowedDomain of allowedDomains) {
        const regexpDomain = new RegExp(allowedDomain.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*'));
        const result = website.match(regexpDomain);
        if (result != null) return true;
    }
    return false;
}