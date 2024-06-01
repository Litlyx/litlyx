
import OpenAI from "openai";
import { EventModel } from "@schema/metrics/EventSchema";


export const AI_EventsFunctions = {
    getEventsCount: ({ pid, from, to, name, metadata }: any) => {
        return getEventsCountForAI(pid, from, to, name, metadata);
    }
}


export const getEventsCountForAIDeclaration: OpenAI.Chat.Completions.ChatCompletionTool = {
    type: 'function',
    function: {
        name: 'getEventsCount',
        description: 'Gets the number of events received on a date range, can also specify the event name and the metadata associated',
        parameters: {
            type: 'object',
            properties: {
                from: { type: 'string', description: 'ISO string of start date including hours' },
                to: { type: 'string', description: 'ISO string of end date including hours' },
                name: { type: 'string', description: 'Name of the events to get' },
                metadata: { type: 'object', description: 'Metadata of events to get' },
            },
            required: ['from', 'to']
        }
    }
}

export const AI_EventsTools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    getEventsCountForAIDeclaration
]

export async function getEventsCountForAI(project_id: string, from?: string, to?: string, name?: string, metadata?: string) {

    const query: any = {
        project_id,
        created_at: {
            $gt: from ? new Date(from).getTime() : new Date(2023).getTime(),
            $lt: to ? new Date(to).getTime() : new Date().getTime(),
        }
    }

    if (metadata) query.metadata = metadata;
    if (name) query.name = name;

    const result = await EventModel.countDocuments(query);

    return { count: result };
}