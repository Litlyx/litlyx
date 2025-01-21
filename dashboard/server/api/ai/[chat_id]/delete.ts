
import { AiChatModel } from "@schema/ai/AiChatSchema";

export default defineEventHandler(async event => {

    const data = await getRequestDataOld(event);
    if (!data) return;

    const { project_id } = data;

    if (!event.context.params) return;
    const chat_id = event.context.params['chat_id'];

    const result = await AiChatModel.updateOne({ _id: chat_id, project_id }, { deleted: true });
    return result.modifiedCount > 0;
});