import { VisitModel } from "@schema/metrics/VisitSchema";
import { executeTimelineAggregation } from "~/server/services/TimelineService";
import { Types } from "mongoose";
import { AIPlugin, AIPlugin_TTool } from "../Plugin";
import { SessionModel } from "@schema/metrics/SessionSchema";

const getSessionsCountsTool: AIPlugin_TTool<'getSessionsCount'> = {
    type: 'function',
    function: {
        name: 'getSessionsCount',
        description: 'Gets the number of sessions (unique visitors) received on a date range',
        parameters: {
            type: 'object',
            properties: {
                from: { type: 'string', description: 'ISO string of start date' },
                to: { type: 'string', description: 'ISO string of end date' },
                min_duration: { type: 'number', description: 'Minimum duration of the session' },
                max_duration: { type: 'number', description: 'Maximum duration of the session' },
            },
            required: ['from', 'to']
        }
    }
}

const getSessionsTimelineTool: AIPlugin_TTool<'getSessionsTimeline'> = {
    type: 'function',
    function: {
        name: 'getSessionsTimeline',
        description: 'Gets an array of date and count for events received on a date range. Should be used to create charts.',
        parameters: {
            type: 'object',
            properties: {
                from: { type: 'string', description: 'ISO string of start date' },
                to: { type: 'string', description: 'ISO string of end date' },
            },
            required: ['from', 'to']
        }
    }
}

export class AiSessions extends AIPlugin<['getSessionsCount', 'getSessionsTimeline']> {

    constructor() {

        super({
            'getSessionsCount': {
                handler: async (data: { project_id: string, from: string, to: string, min_duration?: number, max_duration?: number }) => {

                    const query: any = {
                        project_id: data.project_id,
                        created_at: {
                            $gt: new Date(data.from),
                            $lt: new Date(data.to),
                        },
                        duration: {
                            $gte: data.min_duration || 0,
                            $lte: data.max_duration || 999_999_999,
                        }
                    }

                    const result = await VisitModel.countDocuments(query);
                    return { count: result };
                },
                tool: getSessionsCountsTool
            },
            'getSessionsTimeline': {
                handler: async (data: { project_id: string, from: string, to: string, time_offset: number, website?: string, page?: string }) => {

                    const timelineData = await executeTimelineAggregation({
                        projectId: new Types.ObjectId(data.project_id),
                        model: SessionModel,
                        from: data.from,
                        to: data.to,
                        slice: 'day',
                        timeOffset: data.time_offset
                    });
                    return { data: timelineData };
                },
                tool: getSessionsTimelineTool
            }
        })

    }
}

export const AiSessionsInstance = new AiSessions();
