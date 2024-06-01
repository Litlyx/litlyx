import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { AiChatModel } from "@schema/ai/AiChatSchema";


export default defineEventHandler(async event => {
    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const chatList = await AiChatModel.find({ project_id }, { _id: 1, title: 1 }, { sort: { updated_at: 1 } });
    
    return chatList.map(e => e.toJSON());

});