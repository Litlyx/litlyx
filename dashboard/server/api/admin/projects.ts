import { UserModel } from "@schema/UserSchema";

export type AdminProjectsList = {
    _id: string,
    name: string,
    given_name: string,
    created_at: string,
    email: string,
    projects: {
        _id: string,
        owner: string,
        name: string,
        premium: boolean,
        premium_type: number,
        customer_id: string,
        subscription_id: string,
        premium_expire_at: string,
        created_at: string,
        __v: number,
        counts: { _id: string, project_id: string, events: number, visits: number, sessions: number, updated_at?: string }
    }[],
}

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const data: AdminProjectsList[] = await UserModel.aggregate([
        {
            $lookup: {
                from: "projects",
                localField: "_id",
                foreignField: "owner",
                as: "projects"
            }
        },
        {
            $unwind: {
                path: "$projects",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "project_counts",
                localField: "projects._id",
                foreignField: "project_id",
                as: "projects.counts"
            }
        },
        {
            $addFields: {
                "projects.counts": {
                    $arrayElemAt: ["$projects.counts", 0]
                }
            }
        },
        {
            $group: {
                _id: "$_id",
                name: {
                    $first: "$name"
                },
                given_name: {
                    $first: "$given_name"
                },
                created_at: {
                    $first: "$created_at"
                },
                email: {
                    $first: "$email"
                },
                projects: {
                    $push: "$projects"
                }
            }
        }
    ]);

    return data;

});