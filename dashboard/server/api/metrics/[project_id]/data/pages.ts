
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { VisitModel } from "@schema/metrics/VisitSchema";
import { DATA_EXPIRE_TIME, Redis } from "~/server/services/CacheService";


export type VisitsPageAggregated = {
    _id: string,
    count: number
}

export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;


    const websiteName = getRequestHeader(event, 'x-website-name');
    if (!websiteName) return [];
    const limit = getRequestHeader(event, 'x-query-limit');
    const numLimit = parseInt(limit || '10');


    return await Redis.useCache({
        key: `pages:${project_id}:${websiteName}:${numLimit}`,
        exp: DATA_EXPIRE_TIME
    }, async () => {
        const pages: VisitsPageAggregated[] = await VisitModel.aggregate([
            { $match: { project_id: project._id }, },
            { $match: { website: websiteName, }, },
            { $group: { _id: "$page", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: numLimit }
        ]);

        return pages;
    });




});