import { AiService } from "~/server/services/ai/AiService";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');
    const { user_email, pid } = ctx;

    const query = getQuery(event);

    const { message } = await readBody(event);
    if (!message) throw createError({ status: 400, message: 'message is required' });

    const chat_id = await AiService.handleUserMessage({
        name: user_email.split('@')[0],
        pid,
        text: message,
        chat_id: query.chat_id?.toString()
    });

    return { chat_id }

});