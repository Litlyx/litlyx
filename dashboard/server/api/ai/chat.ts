
import { AiNewChatModel } from "~/shared/schema/ai/AiNewChatSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');
    const { project_id } = ctx;

    const { id } = getQuery(event);

    const chat = await AiNewChatModel.findOne({ _id: id, project_id });
    if (!chat) return;

    return chat;

});