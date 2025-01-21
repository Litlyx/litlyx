
import { AiChatModel } from "@schema/ai/AiChatSchema";

export default defineEventHandler(async event => {
    const data = await getRequestDataOld(event);
    if (!data) return;

    const { project_id } = data;

    if (!event.context.params) return;
    const chat_id = event.context.params['chat_id'];

    const chat = await AiChatModel.findOne({ _id: chat_id, project_id }, { status: 1, completed: 1 });
    if (!chat) return;

    return { status: chat.status, completed: chat.completed || false }
});