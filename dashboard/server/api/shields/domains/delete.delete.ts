import { DomainWhitelistModel } from "~/shared/schema/shields/DomainWhitelistSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;

    const body = await readBody(event);
    const { domain } = body;

    const removal = await DomainWhitelistModel.updateOne({
        project_id: data.project_id
    },
        { $pull: { domains: domain } },
    );

    return { ok: removal.modifiedCount == 1 };
});