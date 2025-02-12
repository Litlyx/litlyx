import { ProjectModel, TProject } from "@schema/project/ProjectSchema";
import { TProjectLimit } from "~/shared/schema/project/ProjectsLimits";

type ExtendedProject = {
    limits: TProjectLimit[],
    counts: [{
        events: number,
        visits: number,
        sessions: number
    }],
    visits: number,
    events: number,
    sessions: number,
    limit_visits: number,
    limit_events: number,
    limit_max: number,
    limit_ai_messages: number,
    limit_ai_max: number,
    limit_total: number
}

export type TAdminProject = TProject & ExtendedProject;

function addFieldsFromArray(data: { fieldName: string, projectedName: string, arrayName: string }[]) {
    const content: Record<string, any> = {};
    data.forEach(e => {
        content[e.projectedName] = {
            "$ifNull": [{ "$getField": { "field": e.fieldName, "input": { "$arrayElemAt": [`$${e.arrayName}`, 0] } } }, 0]
        }
    });
    return content;
}

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const { page, limit, sortQuery } = getQuery(event);

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const projects = await ProjectModel.aggregate([
        {
            $lookup: {
                from: "project_limits",
                localField: "_id",
                foreignField: "project_id",
                as: "limits"
            }
        },
        {
            $lookup: {
                from: "project_counts",
                localField: "_id",
                foreignField: "project_id",
                as: "counts"
            }
        },
        {
            $addFields: addFieldsFromArray([
                { arrayName: 'counts', fieldName: 'visits', projectedName: 'visits' },
                { arrayName: 'counts', fieldName: 'events', projectedName: 'events' },
                { arrayName: 'counts', fieldName: 'session', projectedName: 'session' },
            ]),
        },
        {
            $addFields: addFieldsFromArray([
                { arrayName: 'limits', fieldName: 'visits', projectedName: 'limit_visits' },
                { arrayName: 'limits', fieldName: 'events', projectedName: 'limit_events' },
                { arrayName: 'limits', fieldName: 'limit', projectedName: 'limit_max' },
                { arrayName: 'limits', fieldName: 'ai_messages', projectedName: 'limit_ai_messages' },
                { arrayName: 'limits', fieldName: 'ai_limit', projectedName: 'limit_ai_max' },
            ]),
        },
        {
            $addFields: {
                limit_total: {
                    $add: [
                        { $ifNull: ["$limit_visits", 0] },
                        { $ifNull: ["$limit_events", 0] }
                    ]
                },
            }
        },
        { $unset: 'counts' },
        { $unset: 'limits' },
        { $sort: JSON.parse(sortQuery as string) },
        { $skip: pageNumber * limitNumber },
        { $limit: limitNumber }
    ]);

    return projects as TAdminProject[];

});