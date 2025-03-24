import { BotTrafficOptionModel } from "~/shared/schema/shields/BotTrafficOptionSchema";

export default defineEventHandler(async event => {
    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;
    const result = await BotTrafficOptionModel.findOne({ project_id: data.project_id });
    if (!result) return { block: false };
    return { block: result.block }
});