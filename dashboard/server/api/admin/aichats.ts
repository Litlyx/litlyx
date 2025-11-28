import { AiNewChatModel } from "~/shared/schema/ai/AiNewChatSchema";

export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'admin');
    const result = await AiNewChatModel.find({});
    return result;
});