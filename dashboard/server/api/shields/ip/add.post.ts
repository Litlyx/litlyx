import { AddressBlacklistModel } from "~/shared/schema/shields/AddressBlacklistSchema";

export default defineEventHandler(async event => {
    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;
    const body = await readBody(event);
    const { address, description } = body;
    if (address.trim().length == 0) return setResponseStatus(event, 400, 'Address is required');
    const result = await AddressBlacklistModel.updateOne({ project_id: data.project_id, address }, { description }, { upsert: true });
    return { ok: result.acknowledged };
});