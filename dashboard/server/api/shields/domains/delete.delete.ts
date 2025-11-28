import { DomainWhitelistModel } from "~/shared/schema/shields/DomainWhitelistSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');

    const { project_id } = ctx;

    const body = await readBody(event);
    const { domain } = body;

    const removal = await DomainWhitelistModel.updateOne({ project_id: project_id },
        { $pull: { domains: domain } },
    );

    return { ok: removal.modifiedCount == 1 };
});