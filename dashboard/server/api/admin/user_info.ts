import { ProjectModel, TProject } from "@schema/project/ProjectSchema";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import { TUser, UserModel } from "~/shared/schema/UserSchema";
import { TPremium } from "~/shared/schema/PremiumSchema";
import { Types } from "mongoose";
import { TAdminProject } from "./projects";

export type TAdminUserInfo = {
    user: TUser,
    projects: (TAdminProject & { domains: string[] })[],
    premium: TPremium
}


async function getProjects(user_id: string) {

    function addFieldsFromArray(data: { fieldName: string, projectedName: string, arrayName: string }[]) {
        const content: Record<string, any> = {};
        data.forEach(e => {
            content[e.projectedName] = {
                "$ifNull": [{ "$getField": { "field": e.fieldName, "input": { "$arrayElemAt": [`$${e.arrayName}`, 0] } } }, 0]
            }
        });
        return content;
    }


    const projects = await ProjectModel.aggregate([
        {
            $match: { owner: new Types.ObjectId(user_id) }
        },
        {
            $lookup: {
                from: "user_limits",
                localField: "owner",
                foreignField: "user_id",
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
            $lookup: {
                from: "premiums",
                localField: "owner",
                foreignField: "user_id",
                as: "premium"
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

    return projects as TAdminProject[];
}

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const { user_id } = getQuery(event);

    const result: any = {}

    result.user = await UserModel.findOne({ _id: user_id });
    result.projects = await getProjects(user_id as string);


    const promises: any[] = [];

    for (const project of result.projects) {
        promises.push(new Promise<void>(async resolve => {
            const domains = await VisitModel.aggregate([
                { $match: { project_id: (project as TAdminProject)._id } },
                { $group: { _id: '$website', } }
            ]);
            project.domains = domains.map(e => e._id);
            resolve();
        }));
    }

    await Promise.all(promises);

    return result as TAdminUserInfo;

});