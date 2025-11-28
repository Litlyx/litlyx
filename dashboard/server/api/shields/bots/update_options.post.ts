import { BotTrafficOptionModel } from "~/shared/schema/shields/BotTrafficOptionSchema";

export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'pid');
    const { project_id } = ctx;
    const body = await readBody(event);
    const { block } = body;
    if (block != true && block != false) return setResponseStatus(event, 400, 'block is required and must be true or false');
    const result = await BotTrafficOptionModel.updateOne({ project_id }, { block }, { upsert: true });
    return { ok: result.acknowledged };
});