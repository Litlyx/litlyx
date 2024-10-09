import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { AiChatModel } from "@schema/ai/AiChatSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event);
    if (!data) return;

    const { project_id } = data;
    
    if (!event.context.params) return;
    const chat_id = event.context.params['chat_id'];

    const result = await AiChatModel.deleteOne({ _id: chat_id, project_id });
    return result.deletedCount > 0;
});