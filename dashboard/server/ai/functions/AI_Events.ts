import { EventModel } from "@schema/metrics/EventSchema";
import { executeTimelineAggregation } from "~/server/services/TimelineService";
import { Types } from "mongoose";
import { AIPlugin, AIPlugin_TTool } from "../Plugin";


const getEventsCountTool: AIPlugin_TTool<'getEventsCount'> = {
    type: 'function',
    function: {
        name: 'getEventsCount',
        description: 'Gets the number of events received on a date range, can also specify the event name and the metadata associated',
        parameters: {
            type: 'object',
            properties: {
                from: { type: 'string', description: 'ISO string of start date' },
                to: { type: 'string', description: 'ISO string of end date' },
                name: { type: 'string', description: 'Name of the events to get' },
                metadata: { type: 'object', description: 'Metadata of events to get' },
            },
            required: ['from', 'to']
        }
    }
}

const getEventsTimelineTool: AIPlugin_TTool<'getEventsTimeline'> = {
    type: 'function',
    function: {
        name: 'getEventsTimeline',
        description: 'Gets an array of date and count for events received on a date range. Should be used to create charts.',
        parameters: {
            type: 'object',
            properties: {
                from: { type: 'string', description: 'ISO string of start date' },
                to: { type: 'string', description: 'ISO string of end date' },
                name: { type: 'string', description: 'Name of the events to get' },
                metadata: { type: 'object', description: 'Metadata of events to get' },
            },
            required: ['from', 'to']
        }
    }
}

export class AiEvents extends AIPlugin<['getEventsCount', 'getEventsTimeline']> {

    constructor() {

        super({
            'getEventsCount': {
                handler: async (data: { project_id: string, from: string, to: string, name?: string, metadata?: string }) => {
                    const query: any = {
                        project_id: data.project_id,
                        created_at: {
                            $gt: new Date(data.from),
                            $lt: new Date(data.to),
                        }
                    }
                    if (data.metadata) query.metadata = data.metadata;
                    if (data.name) query.name = data.name;
                    const result = await EventModel.countDocuments(query);
                    return { count: result };
                },
                tool: getEventsCountTool
            },
            'getEventsTimeline': {
                handler: async (data: { project_id: string, from: string, to: string, time_offset: number, name?: string, metadata?: string }) => {

                    const timelineData = await executeTimelineAggregation({
                        projectId: new Types.ObjectId(data.project_id),
                        model: EventModel,
                        from: data.from,
                        to: data.to,
                        slice: 'day',
                        timeOffset: data.time_offset
                    });
                    return { data: timelineData };
                },
                tool: getEventsTimelineTool
            }
        })

    }
}

export const AiEventsInstance = new AiEvents();

