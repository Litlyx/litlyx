import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { AiChatModel } from "@schema/ai/AiChatSchema";
import type OpenAI from "openai";
import { getChartsInMessage } from "~/server/services/AiService";

export default defineEventHandler(async event => {
    const data = await getRequestDataOld(event);
    if (!data) return;

    const isAdmin = data.user.user.roles.includes('ADMIN');

    const { project_id } = data;

    if (!event.context.params) return;
    const chat_id = event.context.params['chat_id'];

    const chat = await AiChatModel.findOne({ _id: chat_id, project_id });
    if (!chat) return;

    return (chat.messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[])
        .filter(e => isAdmin ? true : (e.role === 'assistant' || e.role === 'user'))
        .map(e => {
            const charts = getChartsInMessage(e);
            const content = e.content;
            return { ...e, charts }
        })
        .filter(e => {
            return isAdmin ? true : (e.charts.length > 0 || e.content);
        })
});