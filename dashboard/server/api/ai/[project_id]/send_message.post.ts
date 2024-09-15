import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { sendMessageOnChat } from "~/server/services/AiService";
import { getAiChatRemainings } from "./chats_remaining";



export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user, false);
    if (!project) return;

    // if (!user?.logged) return;
    // if (!user.user.roles.includes('ADMIN')) return;

    const { text, chat_id } = await readBody(event);
    if (!text) return setResponseStatus(event, 400, 'text parameter missing');

    const chatsRemaining = await getAiChatRemainings(project_id);
    if (chatsRemaining <= 0) return setResponseStatus(event, 400, 'CHAT_LIMIT_REACHED');

    const response = await sendMessageOnChat(text, project._id.toString(), chat_id);

    return response;
});