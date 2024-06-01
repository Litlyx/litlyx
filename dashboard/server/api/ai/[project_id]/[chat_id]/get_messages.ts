import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { AiChatModel } from "@schema/ai/AiChatSchema";
import { sendMessageOnChat } from "~/server/services/AiService";



export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    if (!event.context.params) return;
    const chat_id = event.context.params['chat_id'];

    const chat = await AiChatModel.findOne({ _id: chat_id, project_id });
    if (!chat) return;

    const messages = chat.messages.filter(e => {
        return (e.role == 'user' || (e.role == 'assistant' && e.content != undefined))
    }).map(e => {
        return { role: e.role, content: e.content }
    });

    return messages;
});