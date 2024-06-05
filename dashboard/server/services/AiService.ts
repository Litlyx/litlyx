
import { getVisitsCountFromDateRange } from '~/server/api/ai/functions/AI_Visits';

import OpenAI from "openai";
import { AiChatModel } from '@schema/ai/AiChatSchema';
import { AI_EventsFunctions, AI_EventsTools } from '../api/ai/functions/AI_Events';
import { ProjectCountModel } from '@schema/ProjectsCounts';
import { ProjectLimitModel } from '@schema/ProjectsLimits';

const { AI_ORG, AI_PROJECT, AI_KEY } = useRuntimeConfig();

const openai = new OpenAI({
    organization: AI_ORG,
    project: AI_PROJECT,
    apiKey: AI_KEY
});


// const get_current_date: OpenAI.Chat.Completions.ChatCompletionTool = {
//     type: 'function',
//     function: {
//         name: 'get_current_date',
//         description: 'Gets the current date as ISO string',
//     }
// }

const get_visits_count_Schema: OpenAI.Chat.Completions.ChatCompletionTool = {
    type: 'function',
    function: {
        name: 'get_visits_count',
        description: 'Gets the number of visits received on a date range',
        parameters: {
            type: 'object',
            properties: {
                from: { type: 'string', description: 'ISO string of start date including hours' },
                to: { type: 'string', description: 'ISO string of end date including hours' }
            },
            required: ['from', 'to']
        }
    }
}

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    get_visits_count_Schema,
    ...AI_EventsTools
]


const functions: any = {
    get_current_date: async ({ }) => {
        return new Date().toISOString();
    },
    get_visits_count: async ({ pid, from, to }: any) => {
        return await getVisitsCountFromDateRange(pid, from, to);
    },
    ...AI_EventsFunctions
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

export async function sendMessageOnChat(text: string, pid: string, initial_chat_id?: string) {


    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []
    const chat_id = await createChatIfNotExist(pid, initial_chat_id);
    const chatMessages = await getMessagesFromChatId(chat_id);

    if (chatMessages && chatMessages.length > 0) {
        messages.push(...chatMessages);
    } else {
        const roleMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
            role: 'system', content: "Today is " + new Date().toISOString()
        }
        messages.push(roleMessage);
        await addMessageToChat(roleMessage, chat_id);

        await setChatTitle(text.substring(0, 110), chat_id);
    }

    const userMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
        role: 'user', content: text
    }
    messages.push(userMessage);
    await addMessageToChat(userMessage, chat_id);

    let response = await openai.chat.completions.create({ model: 'gpt-3.5-turbo', messages, n: 1, tools });

    let responseMessage = response.choices[0].message;
    let toolCalls = responseMessage.tool_calls;

    await addMessageToChat(responseMessage, chat_id);
    messages.push(responseMessage);


    if (toolCalls) {
        console.log({ toolCalls: toolCalls.length });
        for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            const functionToCall = functions[functionName];
            const functionArgs = JSON.parse(toolCall.function.arguments);
            console.log('CALLING FUNCTION', functionName, 'WITH PARAMS', functionArgs);
            const functionResponse = await functionToCall({ pid, ...functionArgs });
            console.log('RESPONSE FUNCTION', functionName, 'WITH VALUE', functionResponse);
            messages.push({ tool_call_id: toolCall.id, role: "tool", content: JSON.stringify(functionResponse) });
            await addMessageToChat({ tool_call_id: toolCall.id, role: "tool", content: JSON.stringify(functionResponse) }, chat_id);
        }
        response = await openai.chat.completions.create({ model: 'gpt-3.5-turbo', messages, n: 1, tools });
        responseMessage = response.choices[0].message;
        toolCalls = responseMessage.tool_calls;

        await addMessageToChat(responseMessage, chat_id);

    }

    await ProjectLimitModel.updateOne({ project_id: pid }, { $inc: { ai_messages: 1 } })

    return responseMessage.content;
}

