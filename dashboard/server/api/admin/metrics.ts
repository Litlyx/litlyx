import { ProjectModel } from "@schema/project/ProjectSchema";
import { UserModel } from "@schema/UserSchema";
import { EventModel } from "@schema/metrics/EventSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";
import { PremiumModel } from "~/shared/schema/PremiumSchema";


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

    const { filterFrom, filterTo } = getQuery(event);


    const matchQuery = {
        created_at: {
            $gte: new Date(filterFrom as string),
            $lte: new Date(filterTo as string)
        }
    }

    const totalProjects = await ProjectModel.countDocuments({ ...matchQuery });
    const premiumProjects = await PremiumModel.countDocuments({ ...matchQuery, premium_type: { $ne: 0 } });

    const deadProjects = await ProjectModel.aggregate([
        { $match: matchQuery },
        {
            $lookup: {
                from: 'project_counts',
                localField: '_id',
                foreignField: 'project_id',
                as: 'counts'
            }
        },
        {
            $addFields: addFieldsFromArray([
                { arrayName: 'counts', fieldName: 'counts', projectedName: 'counts' },
                { arrayName: 'counts', fieldName: 'updated_at', projectedName: 'updated_at' },
            ])
        },
        {
            $match: {
                updated_at: {
                    $lte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
                }
            }
        },
        { $count: 'count' }
    ])

    const totalUsers = await UserModel.countDocuments({ ...matchQuery });

    const totalVisits = 0;

    const totalEvents = await EventModel.countDocuments({ ...matchQuery });


    return {
        totalProjects, premiumProjects,
        deadProjects: (deadProjects && deadProjects.length > 0 ? deadProjects[0].count : 0) as number,
        totalUsers, totalVisits, totalEvents
    }


});