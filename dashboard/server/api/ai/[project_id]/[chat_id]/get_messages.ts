import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { AiChatModel } from "@schema/ai/AiChatSchema";
import type OpenAI from "openai";
import { getChartsInMessage } from "~/server/services/AiService";

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

    return (chat.messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[])
        .filter(e => e.role === 'assistant' || e.role === 'user')
        .map(e => {
            const charts = getChartsInMessage(e);
            const content = e.content;
            return { role: e.role, content, charts }
        })
        .filter(e=>{
            return e.charts.length > 0 || e.content
        })
});