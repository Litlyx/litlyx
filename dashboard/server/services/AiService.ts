

import OpenAI from "openai";
import { AiChatModel } from '@schema/ai/AiChatSchema';

import { AiEventsInstance } from '../ai/functions/AI_Events';
import { AiVisitsInstance } from '../ai/functions/AI_Visits';
import { AiSessionsInstance } from '../ai/functions/AI_Sessions';
import { AiSnapshotInstance } from '../ai/functions/AI_Snapshots';
import { AiComposableChartInstance } from '../ai/functions/AI_ComposableChart';

const { AI_KEY, AI_ORG, AI_PROJECT } = useRuntimeConfig();

const OPENAI_MODEL: OpenAI.Chat.ChatModel = 'gpt-4o-mini';

const openai = new OpenAI({ apiKey: AI_KEY, organization: AI_ORG, project: AI_PROJECT });

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    ...AiVisitsInstance.getTools(),
    ...AiEventsInstance.getTools(),
    ...AiSessionsInstance.getTools(),
    ...AiSnapshotInstance.getTools(),
    ...AiComposableChartInstance.getTools(),
]


const functions: any = {
    ...AiVisitsInstance.getHandlers(),
    ...AiEventsInstance.getHandlers(),
    ...AiSessionsInstance.getHandlers(),
    ...AiSnapshotInstance.getHandlers(),
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

export async function updateChatStatus(chat_id: string, status: string, completed: boolean) {
    await AiChatModel.updateOne({ _id: chat_id }, {
        status,
        completed
    });
}


export function getChartsInMessage(message: OpenAI.Chat.Completions.ChatCompletionMessageParam) {
    if (message.role != 'assistant') return [];
    if (!message.tool_calls) return [];
    if (message.tool_calls.length == 0) return [];
    return message.tool_calls.filter((e: any) => e.function.name === 'createComposableChart').map((e: any) => e.function.arguments);
}



type FunctionCall = { name: string, argsRaw: string[], collecting: boolean, result: any, tool_call_id: string }

type DeltaCallback = (text: string) => any;
type FinishCallback = (functionsCount: number) => any;
type FunctionNameCallback = (name: string) => any;
type FunctionCallCallback = (name: string) => any;
type FunctionResultCallback = (name: string, result: any) => any;

type ElaborateResponseCallbacks = {
    onDelta?: DeltaCallback,
    onFunctionName?: FunctionNameCallback,
    onFunctionCall?: FunctionCallCallback,
    onFunctionResult?: FunctionResultCallback,
    onFinish?: FinishCallback,
    onChatId?: (chat_id: string) => any
}

async function elaborateResponse(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], pid: string, time_offset: number, chat_id: string, callbacks?: ElaborateResponseCallbacks) {

    console.log('[ELABORATING RESPONSE]');
    console.dir(messages, { depth: Infinity });

    const responseStream = await openai.beta.chat.completions.stream({ model: OPENAI_MODEL, messages, n: 1, tools });

    const functionCalls: FunctionCall[] = [];

    let lastFinishReason: "length" | "tool_calls" | "function_call" | "stop" | "content_filter" | null = null;

    for await (const part of responseStream) {

        const delta = part.choices[0].delta;
        const finishReason = part.choices[0].finish_reason;

        if (delta.content) await callbacks?.onDelta?.(delta.content);

        if (delta.tool_calls) {

            for (const toolCall of delta.tool_calls) {

                if (!toolCall.function) throw Error('Cannot get function from tool_calls');

                const functionName = toolCall.function.name;

                const functionCall: FunctionCall = functionName ?
                    { name: functionName, argsRaw: [], collecting: true, result: null, tool_call_id: toolCall.id as string } :
                    functionCalls.at(-1) as FunctionCall;

                if (functionName) functionCalls.push(functionCall);

                if (functionName) await callbacks?.onFunctionName?.(functionName);

                if (toolCall.function.arguments) functionCall.argsRaw.push(toolCall.function.arguments);
            }


        }

        if (finishReason === "tool_calls" && functionCalls.at(-1)?.collecting) {

            for (const functionCall of functionCalls) {
                await callbacks?.onFunctionCall?.(functionCall.name);
                const args = JSON.parse(functionCall.argsRaw.join(''));

                const functionResult = await functions[functionCall.name]({ project_id: pid, time_offset, ...args });
                functionCall.result = functionResult;
                await callbacks?.onFunctionResult?.(functionCall.name, functionResult);

                await addMessageToChat({
                    role: 'assistant',
                    content: delta.content,
                    refusal: delta.refusal,
                    tool_calls: [
                        {
                            id: functionCall.tool_call_id, type: 'function',
                            function: {
                                name: functionCall.name, arguments: functionCall.argsRaw.join('')
                            }
                        }
                    ]
                }, chat_id);

                await addMessageToChat({ tool_call_id: functionCall.tool_call_id, role: 'tool', content: JSON.stringify(functionCall.result) }, chat_id);
                functionCall.collecting = false;
            }

            lastFinishReason = finishReason;
        }

    }

    await callbacks?.onFinish?.(functionCalls.length);

    const toolResponseMesages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = functionCalls.map(e => {
        return { tool_call_id: e.tool_call_id, role: "tool", content: JSON.stringify(e.result) }
    });

    if (lastFinishReason == 'tool_calls') return await elaborateResponse([...responseStream.messages, ...toolResponseMesages], pid, time_offset, chat_id, callbacks);

    return responseStream;
}


export async function sendMessageOnChat(text: string, pid: string, time_offset: number, initial_chat_id?: string, callbacks?: ElaborateResponseCallbacks) {


    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []
    const chat_id = await createChatIfNotExist(pid, initial_chat_id);
    const chatMessages = await getMessagesFromChatId(chat_id);

    await callbacks?.onChatId?.(chat_id);

    if (chatMessages && chatMessages.length > 0) {
        messages.push(...chatMessages);

        await updateChatStatus(chat_id, '', false);
    } else {
        const roleMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
            role: 'system',
            content: "You are an AI Data Analyst and Growth Hacker specialized in helping users analyze data collected within Litlyx and providing strategies to grow their website, app, or business. Your scope is strictly limited to data creation, visualization, and growth-related advice. If a user asks something outside this domain, politely inform them that you are not designed to answer such questions. Today ISO date is " + new Date().toISOString() + " take this in count when the user ask relative dates"
        }
        messages.push(roleMessage);
        await addMessageToChat(roleMessage, chat_id);

        await setChatTitle(text.substring(0, 110), chat_id);
    }

    const userMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = { role: 'user', content: text }
    messages.push(userMessage);
    await addMessageToChat(userMessage, chat_id);

    try {
        const streamResponse = await elaborateResponse(messages, pid, time_offset, chat_id, callbacks);
        const finalContent = await streamResponse.finalContent();
        await addMessageToChat({ role: 'assistant', refusal: null, content: finalContent }, chat_id);
        return { content: finalContent, charts: [] };
    } catch (ex: any) {
        console.error(ex);
        return { content: ex.message, charts: [] };
    }

}

