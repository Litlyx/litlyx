import { DomainWhitelistModel } from "~/shared/schema/shields/DomainWhitelistSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');

    const { project_id } = ctx;

    const body = await readBody(event);
    const { domain } = body;

    if (domain.trim().length == 0) return setResponseStatus(event, 400, 'Domain is required');

    await DomainWhitelistModel.updateOne({ project_id: project_id },
        { $push: { domains: domain } },
        { upsert: true }
    );

    return { ok: true };
});