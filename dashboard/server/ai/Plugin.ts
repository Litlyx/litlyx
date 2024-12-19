
import type OpenAI from 'openai'


export type AIPlugin_TTool<T extends string> = (OpenAI.Chat.Completions.ChatCompletionTool & { function: { name: T } });

export type AIPlugin_TFunction = (...args: any[]) => any;

type AIPlugin_Constructor<Items extends string[]> = {
    [Key in Items[number]]: {
        tool: AIPlugin_TTool<Key>,
        handler: AIPlugin_TFunction
    }
}

export abstract class AIPlugin<Items extends string[] = []> {
    constructor(public functions: AIPlugin_Constructor<Items>) { }

    getTools() {
        const keys = Object.keys(this.functions) as Items;
        return keys.map((key: Items[number]) => { return this.functions[key].tool });
    }
    getHandlers() {
        const keys = Object.keys(this.functions) as Items;
        const result: Record<string, any> = {};
        keys.forEach((key: Items[number]) => {
            result[key] = this.functions[key].handler;
        });
        return result;
    }
}