import { ProjectModel } from "@schema/ProjectSchema";

export type AdminProjectsList = {
    premium: boolean,
    created_at: Date,
    project_name: string,
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
                from: "visits",
                let: { projectId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$project_id", "$$projectId"]
                            }
                        }
                    },
                    {
                        $count: "total_visits"
                    }
                ],
                as: "visits"
            }
        },
        {
            $lookup: {
                from: "events",
                let: { projectId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$project_id", "$$projectId"]
                            }
                        }
                    },
                    {
                        $count: "total_events"
                    }
                ],
                as: "events"
            }
        },
        {
            $project: {
                project_name: "$name",
                premium: 1,
                created_at: 1,
                user: {
                    $first: "$user"
                },
                total_visits: {
                    $ifNull: [
                        {
                            $arrayElemAt: [
                                "$visits.total_visits",
                                0
                            ]
                        },
                        0
                    ]
                },
                total_events: {
                    $ifNull: [
                        {
                            $arrayElemAt: [
                                "$events.total_events",
                                0
                            ]
                        },
                        0
                    ]
                }
            }
        }
    ]);

    return data;

});