import { AddressBlacklistModel } from "~/shared/schema/shields/AddressBlacklistSchema";

export default defineEventHandler(async event => {
    
    const ctx = await getRequestContext(event, 'pid');
    
    const { project_id } = ctx;

    const body = await readBody(event);
    const { address } = body;

    const removal = await AddressBlacklistModel.deleteOne({ project_id, address });

    return { ok: removal.deletedCount == 1 };
});