import { AddressBlacklistModel } from "~/shared/schema/shields/AddressBlacklistSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');

    const { project_id } = ctx;

    const body = await readBody(event);
    const { address, description } = body;

    if (address.trim().length == 0) return setResponseStatus(event, 400, 'Address is required');
    const result = await AddressBlacklistModel.updateOne({ project_id, address }, { description }, { upsert: true });

    return { ok: result.acknowledged };
});