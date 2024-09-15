import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { AiChatModel } from "@schema/ai/AiChatSchema";

export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    if (!event.context.params) return;
    const chat_id = event.context.params['chat_id'];

    const result = await AiChatModel.deleteOne({ _id: chat_id, project_id });
    return result.deletedCount > 0;
});