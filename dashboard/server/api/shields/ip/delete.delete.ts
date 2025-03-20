import { AddressBlacklistModel } from "~/shared/schema/shields/AddressBlacklistSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;

    const body = await readBody(event);
    const { address } = body;

    const removal = await AddressBlacklistModel.deleteOne({ project_id: data.project_id, address });

    return { ok: removal.deletedCount == 1 };
});