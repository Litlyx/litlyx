import { executeAdvancedTimelineAggregation } from "../../TimelineService";
import { Types } from "mongoose";
import { AiPlugin, getFirstAvailableSliceFromDates } from "../Plugin";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";

const getSessionsTimelinePlugin = new AiPlugin<'getSessionsTimeline', ['from', 'to', 'page', 'domain']>(
    'getSessionsTimeline',
    {
        type: 'function',
        function: {
            name: 'getSessionsTimeline',
            description: 'Gets an array of date and count for sessions (unique visitors) received on a date range.',
            parameters: {
                type: 'object',
                properties: {
                    from: { type: 'string', description: 'ISO string of start date' },
                    to: { type: 'string', description: 'ISO string of end date' },
                    page: { type: 'string', description: 'The page of the visit' },
                    domain: { type: 'string', description: 'Used only to filter a specific domain/website' }
                },
                required: ['from', 'to']
            }
        }
    },
    async (data) => {
        const timelineData = await executeAdvancedTimelineAggregation({
            projectId: new Types.ObjectId(data.project_id),
            model: VisitModel,
            from: new Date(data.from).getTime(),
            to: new Date(data.to).getTime(),
            slice: getFirstAvailableSliceFromDates(data.from, data.to),
            domain: data.domain,
            customIdGroup: { count: '$session' },
            customQueries: [
                {
                    index: 2,
                    query: {
                        $group: { _id: { date: '$_id.date' }, count: { $sum: 1 } }
                    }
                }
            ]
        });
        return timelineData;
    }
);




export const sessionsPlugins = [
    getSessionsTimelinePlugin
]