
import { AiChatModel } from "@schema/ai/AiChatSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event);
    if (!data) return;

    const { project_id } = data;

    const result = await AiChatModel.updateMany({ project_id }, { deleted: true });
    return result.modifiedCount > 0;
});