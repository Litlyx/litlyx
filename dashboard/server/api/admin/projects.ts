import { ProjectModel } from "@schema/ProjectSchema";

export type AdminProjectsList = {
    premium: boolean,
    created_at: Date,
    project_name: string,
    premium_type: number,
    _id: string,
    user: {
        name: string,
        email: string,
        given_name: string,
        picture: string,
        created_at: Date
    },
    total_visits: number,
    total_events: number
}

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const data: AdminProjectsList[] = await ProjectModel.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "user"
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
            $project: {
                project_name: "$name",
                premium: 1,
                premium_type: 1,
                created_at: 1,
                user: {
                    $first: "$user"
                },
                total_visits: {
                    $arrayElemAt: ["$counts.visits", 0]
                },
                total_events: {
                    $arrayElemAt: ["$counts.visits", 0]
                }
            }
        }
    ]);

    return data;

});