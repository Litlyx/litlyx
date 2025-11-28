import { BotTrafficOptionModel } from "~/shared/schema/shields/BotTrafficOptionSchema";

export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'pid');
    const { project_id } = ctx;
    const result = await BotTrafficOptionModel.findOne({ project_id });
    if (!result) return { block: false };
    return { block: result.block }
});