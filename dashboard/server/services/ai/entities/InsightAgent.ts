import { AiMessage, AiPlugin, AiService, OPENAI_MODEL } from "../AiService";
import { visitsPlugins } from "../plugins/VisitsPlugins";
import { sessionsPlugins } from "../plugins/SessionsPlugin";
import { dataPlugins } from "../plugins/DataPlugin";
import { utmDataPlugins } from "../plugins/UTMData";
import { bouncingRatePlugins } from "../plugins/BouncingRatePlugin";

export const AI_PLUGINS: AiPlugin[] = [
    ...visitsPlugins,
    ...sessionsPlugins,
    ...dataPlugins,
    ...utmDataPlugins,
    ...bouncingRatePlugins
];

const DEFAULT_PROMPT = `No fluff, no emojis, no extra words. Compare with the previous period if possible and output only the single insight.`

export class InsightAgent {

    constructor(private pid: string) { }

    async processTools(message: AiMessage, chat: AiMessage[]) {
        if (message.role != 'assistant') return;
        const tool_calls = message.tool_calls;
        if (!tool_calls) return;
        for (const toolCall of tool_calls) {
            const functionName = toolCall.function.name;
            const targetFunction = AI_PLUGINS.find(e => e.name === functionName);
            if (!targetFunction) return;
            const args = JSON.parse(toolCall.function.arguments);
            const result = await targetFunction.handler({ ...args, project_id: this.pid });
            const message: AiMessage = { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(result) };
            chat.push(message)
        }
    }

    async reply(userText: string, chat: AiMessage[]) {

        chat.push({ role: 'system', content: `Current iso date is: ${new Date().toISOString()}` });
        const user_message: AiMessage = {
            role: 'user',
            content: userText,
        };
        chat.push(user_message);

        chat.push({ role: 'system', content: DEFAULT_PROMPT });

        const openai = await AiService.init();

        const response = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: chat,
            tools: AI_PLUGINS.map(e => e.tool)
        });

        const choice = response.choices[0];

        if (choice.finish_reason === 'tool_calls') {
            const chatMessage: AiMessage = { ...choice.message, name: 'Agent' };
            chat.push(chatMessage);
            await this.processTools(chatMessage, chat);
            const afterToolResponse = await openai.chat.completions.create({ model: OPENAI_MODEL, messages: chat });
            const afterToolChatMessage: AiMessage = { ...afterToolResponse.choices[0].message, name: 'Agent' };
            chat.push(afterToolChatMessage);
        } else {
            const chatMessage: AiMessage = { ...choice.message, name: 'Agent' };
            chat.push(chatMessage);
        }

        return chat;

    }

}