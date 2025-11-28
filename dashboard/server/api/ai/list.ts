import { AiNewChatModel } from "~/shared/schema/ai/AiNewChatSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');
    const { project_id } = ctx;

    const chats = await AiNewChatModel.find({ project_id, deleted: false }, { _id: 1, title: 1, created_at: 1, updated_at: 1, status: 1 });

    return chats;

});