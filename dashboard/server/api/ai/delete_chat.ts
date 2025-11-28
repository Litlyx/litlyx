
import { AiNewChatModel } from "~/shared/schema/ai/AiNewChatSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');
    const { project_id } = ctx;

    const { chat_id } = getQuery(event);

    const chat = await AiNewChatModel.updateOne({ _id: chat_id, project_id }, { deleted: true });
    if (!chat) return;

    return chat;

});