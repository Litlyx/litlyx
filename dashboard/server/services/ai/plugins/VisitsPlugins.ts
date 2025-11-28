import { executeAdvancedTimelineAggregation } from "../../TimelineService";
import { Types } from "mongoose";
import { getFirstAvailableSliceFromDates } from "../Plugin";
import { AiPlugin } from "../Plugin";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";

const getVisitsTimelinePlugin = new AiPlugin<'getVisitsTimeline', ['from', 'to', 'page', 'domain', 'continent', 'country', 'region', 'city', 'device']>(
    'getVisitsTimeline',
    {
        type: 'function',
        function: {
            name: 'getVisitsTimeline',
            description: 'Gets an array of date and count for visits received on a date range. Can be filtered for domain, continent, country, region, city, devices.',
            parameters: {
                type: 'object',
                properties: {
                    from: { type: 'string', description: 'ISO string of start date' },
                    to: { type: 'string', description: 'ISO string of end date' },
                    page: { type: 'string', description: 'The page of the visit' },
                    domain: { type: 'string', description: 'Used only to filter a specific domain/website' },
                    device: { type: 'string', description: 'Used only to filter a specific device' },
                    continent: { type: 'string', description: 'Used only to filter a specific continent - 2 letters' },
                    country: { type: 'string', description: 'Used only to filter a specific country - 2 letters' },
                    region: { type: 'string', description: 'Used only to filter a specific region - 2 letters' },
                    city: { type: 'string', description: 'Used only to filter a specific city - 2 letters' },
                },
                required: ['from', 'to']
            }
        }
    },
    async (data) => {

        const match: Record<string, string> = {}

        if (data.device) match.device = data.device;
        if (data.continent) match.continent = data.continent;
        if (data.country) match.country = data.country;
        if (data.region) match.region = data.region;
        if (data.city) match.city = data.city;

        const timelineData = await executeAdvancedTimelineAggregation({
            projectId: new Types.ObjectId(data.project_id),
            model: VisitModel,
            from: new Date(data.from).getTime(),
            to: new Date(data.to).getTime(),
            slice: getFirstAvailableSliceFromDates(data.from, data.to),
            domain: data.domain,
            customMatch: match
        });

        return timelineData;
    }
);


export const visitsPlugins = [
    getVisitsTimelinePlugin
]