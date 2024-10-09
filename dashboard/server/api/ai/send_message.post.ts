import { sendMessageOnChat } from "~/server/services/AiService";
import { getAiChatRemainings } from "./chats_remaining";



export default defineEventHandler(async event => {
    const data = await getRequestData(event);
    if (!data) return;

    const { pid } = data;

    const { text, chat_id } = await readBody(event);
    if (!text) return setResponseStatus(event, 400, 'text parameter missing');

    const chatsRemaining = await getAiChatRemainings(pid);
    if (chatsRemaining <= 0) return setResponseStatus(event, 400, 'CHAT_LIMIT_REACHED');

    const response = await sendMessageOnChat(text, pid, chat_id);

    return response;
});