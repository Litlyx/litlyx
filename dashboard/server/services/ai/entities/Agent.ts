import { AiMessage, AiPlugin, AiService, OPENAI_MODEL } from "../AiService";
import { AiNewChatModel } from "~/shared/schema/ai/AiNewChatSchema";
import { visitsPlugins } from "../plugins/VisitsPlugins";
import { sessionsPlugins } from "../plugins/SessionsPlugin";
import { dataPlugins } from "../plugins/DataPlugin";
import { chartPlugins } from "../plugins/ChartPlugin";
import { utmDataPlugins } from "../plugins/UTMData";
import { bouncingRatePlugins } from "../plugins/BouncingRatePlugin";

export const AI_PLUGINS: AiPlugin[] = [
    ...visitsPlugins,
    ...sessionsPlugins,
    ...dataPlugins,
    // ...chartPlugins,
    ...utmDataPlugins,
    ...bouncingRatePlugins
];

const DEFAULT_PROMPT = `You are an AI analytics agent that transforms structured data from function calls into clear, growth-focused insights, acting like a startup growth analyst explaining results to a founder. You analyze data on visitors, page views, sessions, bounce rates, session duration, and traffic sources, highlighting trends, anomalies, and comparisons in plain language. You identify growth opportunities, funnel bottlenecks, user behavior patterns, and friction points, and suggest concrete, high-impact experiments, quick wins, or growth loops based strictly on the data. Your style is concise, actionable, and easy to understand; you are creative in insights but never in data, you avoid generic advice, and you tailor every suggestion to the dataset provided. Keep initial answers brief unless the user explicitly requests deeper detail, and always end with exactly one specific follow-up question in this format: “Would you like me to analyze [specific aspect]?” Stay strictly within the domain of website and product analytics, respond honestly if something goes beyond your scope, and always prioritize clarity, ROI, and relevance in every response.`

export type AgentConstructorOptions = {
    userName: string,
    pid: string,
    documentId: string
}

export class Agent {

    constructor(private options: AgentConstructorOptions) { }

    async onStartThinking() {
        await AiNewChatModel.updateOne({ _id: this.options.documentId }, { status: `THINKING:Agent` });
    }

    async onStartFunctionCall() {
        await AiNewChatModel.updateOne({ _id: this.options.documentId }, { status: `FUNCTION:Agent` });
    }

    async onChatCompleted() {
        await AiNewChatModel.updateOne({ _id: this.options.documentId }, { status: `COMPLETED` });
    }

    async onChatErrored(error: string) {
        await AiNewChatModel.updateOne({ _id: this.options.documentId }, { status: `ERRORED` });
    }

    async onNewMessage(message: AiMessage) {
        if (message.role === 'system') return;
        const messageWithDate = { ...message, created_at: new Date() }
        await AiNewChatModel.updateOne({ _id: this.options.documentId }, {
            $push: { messages: messageWithDate }
        });
    }

    async processTools(message: AiMessage, chat: AiMessage[]) {
        if (message.role != 'assistant') return;
        const tool_calls = message.tool_calls;
        if (!tool_calls) return;
        for (const toolCall of tool_calls) {
            const functionName = toolCall.function.name;
            const targetFunction = AI_PLUGINS.find(e => e.name === functionName);
            if (!targetFunction) return;
            const args = JSON.parse(toolCall.function.arguments);
            const result = await targetFunction.handler({ ...args, project_id: this.options.pid });
            const message: AiMessage = { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(result) };
            chat.push(message)
            await this.onNewMessage(message);
        }
    }

    async reply(userText: string, chat: AiMessage[]) {

        chat.push({ role: 'system', content: `Current iso date is: ${new Date().toISOString()}` });
        const user_message: AiMessage = {
            role: 'user',
            content: userText,
            name: this.options.userName
        };
        chat.push(user_message);
        await this.onNewMessage(user_message);

        await this.onStartThinking();
        chat.push({ role: 'system', content: DEFAULT_PROMPT + '. Reply in MD format if possible. Try to make the response short. Do not suggest analytics tools that are not Litlyx.' });

        const openai = await AiService.init();

        const response = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: chat,
            tools: AI_PLUGINS.map(e => e.tool)
        });

        const choice = response.choices[0];

        if (choice.finish_reason === 'tool_calls') {

            await this.onStartFunctionCall();
            const chatMessage: AiMessage = { ...choice.message, name: 'Agent' };
            chat.push(chatMessage);
            await this.onNewMessage(chatMessage);
            await this.processTools(chatMessage, chat);

            await this.onStartThinking();
            const afterToolResponse = await openai.chat.completions.create({ model: OPENAI_MODEL, messages: chat });
            const afterToolChatMessage: AiMessage = { ...afterToolResponse.choices[0].message, name: 'Agent' };
            chat.push(afterToolChatMessage);
            await this.onNewMessage(afterToolChatMessage);

        } else {

            const chatMessage: AiMessage = { ...choice.message, name: 'Agent' };
            chat.push(chatMessage);
            await this.onNewMessage(chatMessage);

        }


        await this.onChatCompleted();

    }

}