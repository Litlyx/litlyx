import { BotTrafficOptionModel } from "~/shared/schema/shields/BotTrafficOptionSchema";

export default defineEventHandler(async event => {
    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;
    const body = await readBody(event);
    const { block } = body;

    if (block != true && block != false)
        return setResponseStatus(event, 400, 'block is required and must be true or false');

    const result = await BotTrafficOptionModel.updateOne({ project_id: data.project_id }, { block }, { upsert: true });
    return { ok: result.acknowledged };
});