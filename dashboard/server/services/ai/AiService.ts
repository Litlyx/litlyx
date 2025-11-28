import OpenAI from "openai";
import { AiNewChatModel } from "~/shared/schema/ai/AiNewChatSchema";
import { Types } from 'mongoose';
import { Agent } from "./entities/Agent";
import { InsightAgent } from "./entities/InsightAgent";

export const OPENAI_MODEL: OpenAI.Chat.ChatModel = 'gpt-4o-mini';

export type AiMessage =
    OpenAI.Chat.Completions.ChatCompletionMessage |
    OpenAI.Chat.Completions.ChatCompletionMessageParam |
    OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam |
    OpenAI.Chat.Completions.ChatCompletionDeveloperMessageParam;


export type AiTool<T extends string = any> =
    OpenAI.Chat.Completions.ChatCompletionTool
    & { function: { name: T } }

export type AiPlugin<T extends string = any> = {
    name: T,
    handler: (...args: any[]) => any,
    tool: AiTool<T>
}

export type AiHandleUserMessageOptions = {
    pid: string,
    text: string,
    name: string,
    chat_id?: string
}

export class AiService {

    private static openai: OpenAI;


    static init() {
        if (this.openai) return this.openai;
        const { AI_KEY, AI_ORG, AI_PROJECT } = useRuntimeConfig();
        const openai = new OpenAI({ apiKey: AI_KEY, organization: AI_ORG, project: AI_PROJECT });
        this.openai = openai;
        return openai;
    }

    static async generateInsight(pid: string) {
        const timestamp = ['month', 'week'];
        const data = ['visits', 'referrers', 'browsers', 'devices'];

        const agent = new InsightAgent(pid);

        const dataType = data[Math.floor(Math.random() * data.length)];
        const timeFrame = timestamp[Math.floor(Math.random() * timestamp.length)];

        const PROMPT = 'Give me one concise, anomaly-focused insight on [DATA_TYPE] for last [TIME_FRAME], compared to 2 [TIME_FRAME] ago. Respond with only the single insight, in plain text, no fluff, no emojis, no extra wording..'
            .replace('[DATA_TYPE]', dataType)
            .replace('[TIME_FRAME]', timeFrame)
            .replace('[TIME_FRAME]', timeFrame);

        const res = await agent.reply(PROMPT, []);
        return res.at(-1)?.content ?? 'ERROR_GENERATING_INSIGHT';
    }


    static async handleUserMessage(options: AiHandleUserMessageOptions) {

        let chat;

        try {
            if (options.chat_id) {
                const chatUUID = new Types.ObjectId(options.chat_id);
                chat = await AiNewChatModel.findOne({ _id: chatUUID });
            }
        } catch (ex) {

        }

        let currentMessages: AiMessage[] = [];

        if (!chat) {
            chat = await AiNewChatModel.create({
                title: options.text.substring(0, 60),
                status: 'PROCESSING',
                messages: [],
                deleted: false,
                project_id: options.pid
            });
        } else {
            if (!chat.status.startsWith('COMPLETED') && !chat.status.startsWith('ERRORED')) return;
            if (chat.messages.length >= 100) {
                await AiNewChatModel.updateOne({ _id: chat._id }, { status: 'ERRORED' });
                return chat._id.toString();
            }
            currentMessages.push(...chat.messages);
        }

        const agent = new Agent({ documentId: chat._id.toString(), pid: options.pid, userName: options.name });
        agent.reply(options.text, currentMessages);

        return chat._id.toString();

    }



}