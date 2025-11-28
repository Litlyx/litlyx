
import { AiNewChatModel } from "~/shared/schema/ai/AiNewChatSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');
    const { project_id } = ctx;

    const chat = await AiNewChatModel.updateMany({ project_id }, { deleted: true });
    if (!chat) return;

    return chat;

});