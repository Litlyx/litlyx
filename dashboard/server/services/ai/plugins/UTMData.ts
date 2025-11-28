import { Types } from "mongoose";
import { AiPlugin } from "../Plugin";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import { getDomainFromString } from "~/server/utils/getRequestContext";
import { UtmKey } from "~/components/complex/line-data/selectors/SelectRefer.vue";



const utmKeys = ["utm_medium", "utm_source", "utm_term", "utm_campaign", "utm_content"]

const plugins: AiPlugin[] = []

for (const utmKey of utmKeys) {

    const getUtmPlugin = new AiPlugin<`get_${typeof utmKey}`, ['domain', 'from', 'to', 'limit']>(`get_${utmKey}`,
        {
            type: 'function',
            function: {
                name: `get_${utmKey}`,
                parameters: {
                    type: 'object',
                    properties: {
                        from: { type: 'string', description: 'ISO string of start date' },
                        to: { type: 'string', description: 'ISO string of end date' },
                        domain: { type: 'string', description: 'Used only to filter a specific webdomain/website' },
                        limit: { type: 'number', description: 'Max number of items to return' }
                    },
                    required: ['from', 'to']
                },
                description: `Gets an array of all the ${utmKey} of the visits in a date range`,
            }
        },
        async ({ domain, from, to, project_id, limit }) => {

            const websiteMatch = domain ? { website: domain } : {};

            const result = await VisitModel.aggregate([
                {
                    $match: {
                        project_id: new Types.ObjectId(project_id),
                        created_at: { $gte: new Date(from), $lte: new Date(to) },
                        ...websiteMatch,
                        [utmKey]: { $ne: null }
                    }
                },
                {
                    $group: {
                        _id: `$${utmKey}`,
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: Math.min(limit ?? 500, 500) }
            ]);


            return result as { _id: string, count: number }[];

        });

    plugins.push(getUtmPlugin);
}



export const utmDataPlugins = plugins;