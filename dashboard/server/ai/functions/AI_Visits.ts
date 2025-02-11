import { VisitModel } from "@schema/metrics/VisitSchema";
import { executeTimelineAggregation } from "~/server/services/TimelineService";
import { Types } from "mongoose";
import { AIPlugin, AIPlugin_TTool } from "../Plugin";

const getVisitsCountsTool: AIPlugin_TTool<'getVisitsCount'> = {
    type: 'function',
    function: {
        name: 'getVisitsCount',
        description: 'Gets the number of visits received on a date range',
        parameters: {
            type: 'object',
            properties: {
                from: { type: 'string', description: 'ISO string of start date' },
                to: { type: 'string', description: 'ISO string of end date' },
                website: { type: 'string', description: 'The website of the visits' },
                page: { type: 'string', description: 'The page of the visit' },
                domain: { type: 'string', description: 'Used only to filter a specific domain' }
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
                from: { type: 'string', description: 'ISO string of start date' },
                to: { type: 'string', description: 'ISO string of end date' },
                website: { type: 'string', description: 'The website of the visits' },
                page: { type: 'string', description: 'The page of the visit' },
                domain: { type: 'string', description: 'Used only to filter a specific domain' }
            },
            required: ['from', 'to']
        }
    }
}

export class AiVisits extends AIPlugin<['getVisitsCount', 'getVisitsTimeline']> {

    constructor() {

        super({
            'getVisitsCount': {
                handler: async (data: { project_id: string, from: string, to: string, website?: string, page?: string, domain?: string }) => {

                    const query: any = {
                        project_id: data.project_id,
                        created_at: {
                            $gt: new Date(data.from),
                            $lt: new Date(data.to),
                        },
                        website: data.domain || { $ne: '_NODOMAIN_' }
                    }

                    if (data.website) query.website = data.website;

                    if (data.page) query.page = data.page;

                    const result = await VisitModel.countDocuments(query);

                    return { count: result };

                },
                tool: getVisitsCountsTool
            },
            'getVisitsTimeline': {
                handler: async (data: { project_id: string, from: string, to: string, time_offset: number, website?: string, page?: string, domain?: string }) => {

                    const timelineData = await executeTimelineAggregation({
                        projectId: new Types.ObjectId(data.project_id),
                        model: VisitModel,
                        from: data.from,
                        to: data.to,
                        slice: 'day',
                        timeOffset: data.time_offset,
                        domain: data.domain || { $ne: '_NODOMAIN_' } as any
                    });
                    return { data: timelineData };
                },
                tool: getVisitsTimelineTool
            }
        })

    }
}

export const AiVisitsInstance = new AiVisits();
