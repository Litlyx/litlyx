import { EventModel } from "@schema/metrics/EventSchema";
import { AdvancedTimelineAggregationOptions, executeAdvancedTimelineAggregation, executeTimelineAggregation, fillAndMergeTimelineAggregationV2 } from "~/server/services/TimelineService";
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
                from: { type: 'string', description: 'ISO string of start date including hours' },
                to: { type: 'string', description: 'ISO string of end date including hours' },
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
                from: { type: 'string', description: 'ISO string of start date including hours' },
                to: { type: 'string', description: 'ISO string of end date including hours' },
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
                handler: async (data: { project_id: string, from?: string, to?: string, name?: string, metadata?: string }) => {
                    const query: any = {
                        project_id: data.project_id,
                        created_at: {
                            $gt: data.from ? new Date(data.from).getTime() : new Date(2023).getTime(),
                            $lt: data.to ? new Date(data.to).getTime() : new Date().getTime(),
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
                handler: async (data: { project_id: string, from: string, to: string, name?: string, metadata?: string }) => {
                    const query: AdvancedTimelineAggregationOptions & { customMatch: Record<string, any> } = {
                        projectId: new Types.ObjectId(data.project_id) as any,
                        model: EventModel,
                        from: data.from, to: data.to, slice: 'day',
                        customMatch: {}
                    }
                    if (data.metadata) query.customMatch.metadata = data.metadata;
                    if (data.name) query.customMatch.name = data.name;

                    const timelineData = await executeAdvancedTimelineAggregation(query);
                    const timelineFilledMerged = fillAndMergeTimelineAggregationV2(timelineData, 'day', data.from, data.to);
                    return { data: timelineFilledMerged };
                },
                tool: getEventsTimelineTool
            }
        })

    }
}

export const AiEventsInstance = new AiEvents();

