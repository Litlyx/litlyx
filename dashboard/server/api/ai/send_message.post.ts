import { sendMessageOnChat, updateChatStatus } from "~/server/services/AiService";
import { getAiChatRemainings } from "./chats_remaining";



export default defineEventHandler(async event => {
    const data = await getRequestData(event);
    if (!data) return;

    const { pid } = data;

    const { text, chat_id, timeOffset } = await readBody(event);
    if (!text) return setResponseStatus(event, 400, 'text parameter missing');

    const chatsRemaining = await getAiChatRemainings(pid);
    if (chatsRemaining <= 0) return setResponseStatus(event, 400, 'CHAT_LIMIT_REACHED');

    const currentStatus: string[] = [];

    let responseSent = false;

    let targetChatId = '';

    await sendMessageOnChat(text, pid, timeOffset, chat_id, {
        onChatId: async chat_id => {
            if (!responseSent) {
                event.node.res.setHeader('Content-Type', 'application/json');
                event.node.res.end(JSON.stringify({ chat_id }));
                targetChatId = chat_id;
                responseSent = true;
            }
        },
        onDelta: async text => {
            currentStatus.push(text);
            await updateChatStatus(targetChatId, currentStatus.join(''), false);
        },
        onFunctionName: async name => {
            currentStatus.push('[data:FunctionName]');
            await updateChatStatus(targetChatId, currentStatus.join(''), false);
        },
        onFunctionCall: async name => {
            currentStatus.push('[data:FunctionCall]');
            await updateChatStatus(targetChatId, currentStatus.join(''), false);
        },
        onFunctionResult: async (name, result) => {
            currentStatus.push('[data:FunctionResult]');
            await updateChatStatus(targetChatId, currentStatus.join(''), false);
        },
        onFinish: async calls => {
            // currentStatus.push('[data:FunctionFinish]');
            // await updateChatStatus(targetChatId, currentStatus.join(''), false);
        }
    });

    await updateChatStatus(targetChatId, currentStatus.join(''), true);

});