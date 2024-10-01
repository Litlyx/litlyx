import { VisitModel } from "@schema/metrics/VisitSchema";
import { AdvancedTimelineAggregationOptions, executeAdvancedTimelineAggregation, executeTimelineAggregation, fillAndMergeTimelineAggregationV2 } from "~/server/services/TimelineService";
import { Types } from "mongoose";
import { AIPlugin, AIPlugin_TTool } from "../Plugin";
import dayjs from 'dayjs';

const getVisitsCountsTool: AIPlugin_TTool<'getVisitsCount'> = {
    type: 'function',
    function: {
        name: 'getVisitsCount',
        description: 'Gets the number of visits received on a date range',
        parameters: {
            type: 'object',
            properties: {
                from: { type: 'string', description: 'ISO string of start date including hours' },
                to: { type: 'string', description: 'ISO string of end date including hours' },
                website: { type: 'string', description: 'The website of the visits' },
                page: { type: 'string', description: 'The page of the visit' }
            },
            required: ['from', 'to']
        }
    }
}

const getVisitsTimelineTool: AIPlugin_TTool<'getVisitsTimeline'> = {
    type: 'function',
    function: {
        name: 'getVisitsTimeline',
        description: 'Gets an array of date and count for events received on a date range. Should be used to create charts.',
        parameters: {
            type: 'object',
            properties: {
                from: { type: 'string', description: 'ISO string of start date including hours' },
                to: { type: 'string', description: 'ISO string of end date including hours' },
                website: { type: 'string', description: 'The website of the visits' },
                page: { type: 'string', description: 'The page of the visit' }
            },
            required: ['from', 'to']
        }
    }
}

export class AiVisits extends AIPlugin<['getVisitsCount', 'getVisitsTimeline']> {

    constructor() {

        super({
            'getVisitsCount': {
                handler: async (data: { project_id: string, from?: string, to?: string, website?: string, page?: string }) => {
                    const query: any = {
                        project_id: data.project_id,
                        created_at: {
                            $gt: data.from ? new Date(data.from).getTime() : new Date(2023).getTime(),
                            $lt: data.to ? new Date(data.to).getTime() : new Date().getTime(),
                        }
                    }
                    if (data.website) query.website = data.website;
                    if (data.page) query.page = data.page;
                    const result = await VisitModel.countDocuments(query);
                    return { count: result };
                },
                tool: getVisitsCountsTool
            },
            'getVisitsTimeline': {
                handler: async (data: { project_id: string, from: string, to: string, website?: string, page?: string }) => {

                    const query: AdvancedTimelineAggregationOptions & { customMatch: Record<string, any> } = {
                        projectId: new Types.ObjectId(data.project_id) as any,
                        model: VisitModel,
                        from: dayjs(data.from).startOf('day').toISOString(),
                        to: dayjs(data.to).startOf('day').toISOString(),
                        slice: 'day',
                        customMatch: {}
                    }

                    if (data.website) query.customMatch.website = data.website;
                    if (data.page) query.customMatch.page = data.page;

                    const timelineData = await executeAdvancedTimelineAggregation(query);
                    const timelineFilledMerged = fillAndMergeTimelineAggregationV2(timelineData, 'day', data.from, data.to);
                    return { data: timelineFilledMerged };
                },
                tool: getVisitsTimelineTool
            }
        })

    }
}

export const AiVisitsInstance = new AiVisits();
