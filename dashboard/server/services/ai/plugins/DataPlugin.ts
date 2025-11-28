import { Types } from "mongoose";
import { AiPlugin } from "../Plugin";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import { getDomainFromString } from "~/server/utils/getRequestContext";

const getReferrersPlugin = new AiPlugin<'getReferrers', ['from', 'to', 'domain', 'limit']>('getReferrers',
    {
        type: 'function',
        function: {
            name: 'getReferrers',
            description: 'Gets an array of website referrers (visit sources) on a date range.',
            parameters: {
                type: 'object',
                properties: {
                    from: { type: 'string', description: 'ISO string of start date' },
                    to: { type: 'string', description: 'ISO string of end date' },
                    domain: { type: 'string', description: 'Used only to filter a specific webdomain/website' },
                    limit: { type: 'number', description: 'Max number of items to return' }
                },
                required: ['from', 'to']
            }
        }
    },
    async (data) => {

        const result = await VisitModel.aggregate([
            {
                $match: {
                    project_id: new Types.ObjectId(data.project_id),
                    created_at: {
                        $gte: new Date(data.from),
                        $lte: new Date(data.to)
                    },
                    website: getDomainFromString(data.domain ?? '*') ?? { $ne: null },
                }
            },
            { $group: { _id: "$referrer", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: Math.min(data.limit ?? 500, 500) }
        ]);

        return result as { _id: string, count: number }[];
    }
);

const getContinentsPlugin = new AiPlugin<'getContinents', ['from', 'to', 'domain', 'limit']>('getContinents',
    {
        type: 'function',
        function: {
            name: 'getContinents',
            description: 'Gets an array of continents that visited the user website on a date range.',
            parameters: {
                type: 'object',
                properties: {
                    from: { type: 'string', description: 'ISO string of start date' },
                    to: { type: 'string', description: 'ISO string of end date' },
                    domain: { type: 'string', description: 'Used only to filter a specific webdomain/website' },
                    limit: { type: 'number', description: 'Max number of items to return' }
                },
                required: ['from', 'to']
            }
        }
    },
    async (data) => {

        const result = await VisitModel.aggregate([
            {
                $match: {
                    project_id: new Types.ObjectId(data.project_id),
                    created_at: {
                        $gte: new Date(data.from),
                        $lte: new Date(data.to)
                    },
                    website: getDomainFromString(data.domain ?? '*') ?? { $ne: null },
                }
            },
            { $group: { _id: "$continent", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: Math.min(data.limit ?? 500, 500) }
        ]);

        return result as { _id: string, count: number }[];
    }
);

const getCountriesPlugin = new AiPlugin<'getCountries', ['from', 'to', 'domain', 'limit']>('getCountries',
    {
        type: 'function',
        function: {
            name: 'getCountries',
            description: 'Gets an array of countries that visited the user website on a date range.',
            parameters: {
                type: 'object',
                properties: {
                    from: { type: 'string', description: 'ISO string of start date' },
                    to: { type: 'string', description: 'ISO string of end date' },
                    domain: { type: 'string', description: 'Used only to filter a specific webdomain/website' },
                    limit: { type: 'number', description: 'Max number of items to return' }
                },
                required: ['from', 'to']
            }
        }
    },
    async (data) => {

        const result = await VisitModel.aggregate([
            {
                $match: {
                    project_id: new Types.ObjectId(data.project_id),
                    created_at: {
                        $gte: new Date(data.from),
                        $lte: new Date(data.to)
                    },
                    website: getDomainFromString(data.domain ?? '*') ?? { $ne: null },
                }
            },
            { $group: { _id: "$country", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: Math.min(data.limit ?? 500, 500) }
        ]);

        return result as { _id: string, count: number }[];
    }
);

const getPagesPlugin = new AiPlugin<'getPages', ['from', 'to', 'domain', 'limit']>('getPages',
    {
        type: 'function',
        function: {
            name: 'getPages',
            description: 'Gets an array of most visited pages on a date range.',
            parameters: {
                type: 'object',
                properties: {
                    from: { type: 'string', description: 'ISO string of start date' },
                    to: { type: 'string', description: 'ISO string of end date' },
                    domain: { type: 'string', description: 'Used only to filter a specific webdomain/website' },
                    limit: { type: 'number', description: 'Max number of items to return' }
                },
                required: ['from', 'to']
            }
        }
    },
    async (data) => {

        const result = await VisitModel.aggregate([
            {
                $match: {
                    project_id: new Types.ObjectId(data.project_id),
                    created_at: {
                        $gte: new Date(data.from),
                        $lte: new Date(data.to)
                    },
                    website: getDomainFromString(data.domain ?? '*') ?? { $ne: null },
                }
            },
            { $group: { _id: "$page", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: Math.min(data.limit ?? 500, 500) }
        ]);

        return result as { _id: string, count: number }[];
    }
);

const getBrowsersPlugin = new AiPlugin<'getBrowsers', ['from', 'to', 'domain', 'limit']>('getBrowsers',
    {
        type: 'function',
        function: {
            name: 'getBrowsers',
            description: 'Gets an array of browsers that visited the user website on a date range.',
            parameters: {
                type: 'object',
                properties: {
                    from: { type: 'string', description: 'ISO string of start date' },
                    to: { type: 'string', description: 'ISO string of end date' },
                    domain: { type: 'string', description: 'Used only to filter a specific webdomain/website' },
                    limit: { type: 'number', description: 'Max number of items to return' }
                },
                required: ['from', 'to']
            }
        }
    },
    async (data) => {

        const result = await VisitModel.aggregate([
            {
                $match: {
                    project_id: new Types.ObjectId(data.project_id),
                    created_at: {
                        $gte: new Date(data.from),
                        $lte: new Date(data.to)
                    },
                    website: getDomainFromString(data.domain ?? '*') ?? { $ne: null },
                }
            },
            { $group: { _id: "$browser", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: Math.min(data.limit ?? 500, 500) }
        ]);

        return result as { _id: string, count: number }[];
    }
);

const getDevicesPlugin = new AiPlugin<'getDevices', ['from', 'to', 'domain', 'limit']>('getDevices',
    {
        type: 'function',
        function: {
            name: 'getDevices',
            description: 'Gets an array of devices that visited the user website on a date range.',
            parameters: {
                type: 'object',
                properties: {
                    from: { type: 'string', description: 'ISO string of start date' },
                    to: { type: 'string', description: 'ISO string of end date' },
                    domain: { type: 'string', description: 'Used only to filter a specific webdomain/website' },
                    limit: { type: 'number', description: 'Max number of items to return' }
                },
                required: ['from', 'to']
            }
        }
    },
    async (data) => {

        const result = await VisitModel.aggregate([
            {
                $match: {
                    project_id: new Types.ObjectId(data.project_id),
                    created_at: {
                        $gte: new Date(data.from),
                        $lte: new Date(data.to)
                    },
                    website: getDomainFromString(data.domain ?? '*') ?? { $ne: null },
                }
            },
            { $group: { _id: "$device", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: Math.min(data.limit ?? 500, 500) }
        ]);

        return result as { _id: string, count: number }[];
    }
);

export const dataPlugins = [
    getReferrersPlugin,
    getContinentsPlugin,
    getCountriesPlugin,
    getPagesPlugin,
    getBrowsersPlugin,
    getDevicesPlugin
]