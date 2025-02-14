import { ProjectModel, TProject } from "@schema/project/ProjectSchema";
import { TProjectLimit } from "~/shared/schema/project/ProjectsLimits";
import { TAdminProject } from "./projects";
import { Types } from "mongoose";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";

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

    const { pid } = getQuery(event);

    const projects = await ProjectModel.aggregate([
        {
            $match: { _id: new Types.ObjectId(pid as string) }
        },
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
                { arrayName: 'counts', fieldName: 'updated_at', projectedName: 'last_log_at' },
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
    ]);

    const domains = await VisitModel.aggregate([
        {
            $match: { project_id: new Types.ObjectId(pid as string) }
        },
        {
            $group: {
                _id: '$website',
            }
        }
    ])

    return { domains, project: (projects[0] as TAdminProject) };

});