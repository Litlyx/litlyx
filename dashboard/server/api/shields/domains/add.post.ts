import { DomainWhitelistModel } from "~/shared/schema/shields/DomainWhitelistSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;

    const body = await readBody(event);
    const { domain } = body;

    if (domain.trim().length == 0) return setResponseStatus(event, 400, 'Domain is required');

    const whitelist = await DomainWhitelistModel.updateOne({
        project_id: data.project_id
    },
        { $push: { domains: domain } },
        { upsert: true }
    );

    return { ok: true };
});