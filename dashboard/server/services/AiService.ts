

import OpenAI from "openai";
import { AiChatModel } from '@schema/ai/AiChatSchema';
import { ProjectCountModel } from '@schema/ProjectsCounts';
import { ProjectLimitModel } from '@schema/ProjectsLimits';

import { AiEventsInstance } from '../ai/functions/AI_Events';
import { AiVisitsInstance } from '../ai/functions/AI_Visits';
import { AiComposableChartInstance } from '../ai/functions/AI_ComposableChart';

const { AI_ORG, AI_PROJECT, AI_KEY } = useRuntimeConfig();

const OPENAI_MODEL: OpenAI.Chat.ChatModel = 'gpt-4o-mini';

const openai = new OpenAI({
    organization: AI_ORG,
    project: AI_PROJECT,
    apiKey: AI_KEY
});

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    ...AiVisitsInstance.getTools(),
    ...AiEventsInstance.getTools(),
    ...AiComposableChartInstance.getTools()
]


const functions: any = {
    ...AiVisitsInstance.getHandlers(),
    ...AiEventsInstance.getHandlers(),
    ...AiComposableChartInstance.getHandlers()
}


async function getMessagesFromChatId(chat_id?: string) {
    if (!chat_id) return;
    const chatItem = await AiChatModel.findById(chat_id);
    if (!chatItem) return;
    return chatItem.messages;
}

async function addMessageToChat(message: any, chat_id?: string) {
    if (!chat_id) return;
    await AiChatModel.updateOne({ _id: chat_id }, { $push: { messages: message } });
}

async function createChatIfNotExist(pid: string, chat_id?: string) {
    const chatItem = await AiChatModel.exists({ _id: chat_id });
    if (chatItem) return chatItem._id.toString();
    const newChatItem = await AiChatModel.create({ messages: [], project_id: pid, title: 'new chat' });
    return newChatItem._id.toString();
}

async function setChatTitle(title: string, chat_id?: string) {
    if (!chat_id) return;
    await AiChatModel.updateOne({ _id: chat_id }, { title });
}


export function getChartsInMessage(message: OpenAI.Chat.Completions.ChatCompletionMessageParam) {
    if (message.role != 'assistant') return [];
    if (!message.tool_calls) return [];
    if (message.tool_calls.length == 0) return [];
    return message.tool_calls.filter(e => e.function.name === 'createComposableChart').map(e => e.function.arguments);
}

export async function sendMessageOnChat(text: string, pid: string, initial_chat_id?: string) {


    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []
    const chat_id = await createChatIfNotExist(pid, initial_chat_id);
    const chatMessages = await getMessagesFromChatId(chat_id);

    if (chatMessages && chatMessages.length > 0) {
        messages.push(...chatMessages);
    } else {
        const roleMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
            role: 'system',
            content: "Today ISO date: " + new Date().toISOString()
        }
        messages.push(roleMessage);
        await addMessageToChat(roleMessage, chat_id);

        await setChatTitle(text.substring(0, 110), chat_id);
    }

    const userMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = { role: 'user', content: text }
    messages.push(userMessage);
    await addMessageToChat(userMessage, chat_id);

    let response = await openai.chat.completions.create({ model: OPENAI_MODEL, messages, n: 1, tools });

    const chartsData: string[][] = [];

    while ((response.choices[0].message.tool_calls?.length || 0) > 0) {
        await addMessageToChat(response.choices[0].message, chat_id);
        messages.push(response.choices[0].message);
        if (response.choices[0].message.tool_calls) {

            console.log('Tools to call', response.choices[0].message.tool_calls.length);
            chartsData.push(getChartsInMessage(response.choices[0].message));

            for (const toolCall of response.choices[0].message.tool_calls) {
                const functionName = toolCall.function.name;
                console.log('Calling tool function', functionName);
                const functionToCall = functions[functionName];
                const functionArgs = JSON.parse(toolCall.function.arguments);
                const functionResponse = await functionToCall({ project_id: pid, ...functionArgs });
                messages.push({ tool_call_id: toolCall.id, role: "tool", content: JSON.stringify(functionResponse) });
                await addMessageToChat({ tool_call_id: toolCall.id, role: "tool", content: JSON.stringify(functionResponse) }, chat_id);
            }
        }
        response = await openai.chat.completions.create({ model: OPENAI_MODEL, messages, n: 1, tools });
    }
    await addMessageToChat(response.choices[0].message, chat_id);
    await ProjectLimitModel.updateOne({ project_id: pid }, { $inc: { ai_messages: 1 } })
    return { content: response.choices[0].message.content, charts: chartsData.filter(e => e.length > 0).flat() };
}

