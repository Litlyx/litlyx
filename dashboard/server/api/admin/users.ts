import { ProjectModel } from "~/shared/schema/project/ProjectSchema";
import { UserModel } from "~/shared/schema/UserSchema";
import { parseNumberInt } from "~/utils/parseNumber";

export type TAdminUser = {
    email: string;
    premium_type: string;
    created_at: string;
    limit: number;
    visits: number;
    events: number;
    projects: { name: string, counts: [any], _id: string }[]
}

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'admin');

    const { page, limit, from, to, sort, search } = getQuery(event);

    const pageValue = parseNumberInt(page, 1);
    const limitValue = parseNumberInt(limit, 10);
    const skipValue = (pageValue - 1) * limitValue;


    const getSortQuery: () => any = () => {
        if (sort === 'usage-more') return { visits: -1 }
        if (sort === 'usage-less') return { visits: 1 }
        if (sort === 'newer') return { created_at: -1 }
        if (sort === 'older') return { created_at: 1 }
        return { created_at: -1 }
    }


    let users: any[] = [];

    if (!search || search === '') {
        users = await UserModel.aggregate([
            {
                $match: {
                    created_at: {
                        $gte: new Date(from as string),
                        $lte: new Date(to as string),
                    }
                }
            },
            {
                $lookup: {
                    from: "premiums",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "premiums"
                }
            },
            {
                $lookup: {
                    from: "user_limits",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "limits"
                }
            },
            {
                $lookup: {
                    from: "projects",
                    let: {
                        userId: "$_id"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$$userId", "$owner"]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "project_counts",
                                localField: "_id",
                                foreignField: "project_id",
                                as: "counts"
                            }
                        }
                    ],
                    as: "projects"
                }
            },
            {
                $project: {
                    email: "$email",
                    created_at: "$created_at",
                    premium_type: {
                        $arrayElemAt: [
                            "$premiums.premium_type",
                            0
                        ]
                    },
                    limit: {
                        $arrayElemAt: ["$limits.limit", 0]
                    },
                    visits: {
                        $arrayElemAt: ["$limits.visits", 0]
                    },
                    events: {
                        $arrayElemAt: ["$limits.events", 0]
                    },
                    projects: 1
                }
            },
            {
                $sort: getSortQuery()
            },
            {
                $skip: skipValue
            },
            {
                $limit: limitValue
            }
        ])
    } else {

        const matchingProjects = await ProjectModel.find({
            name: { $regex: new RegExp(search as string) }
        }, { owner: 1 });



        users = await UserModel.aggregate([
            {
                $match: {
                    $or: [
                        { _id: { $in: matchingProjects.map(e => e.owner) } },
                        { name: { $regex: new RegExp(search as string) } },
                        { email: { $regex: new RegExp(search as string) } },
                    ]
                }
            },
            {
                $lookup: {
                    from: "premiums",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "premiums"
                }
            },
            {
                $lookup: {
                    from: "user_limits",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "limits"
                }
            },
            {
                $lookup: {
                    from: "projects",
                    let: {
                        userId: "$_id"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$$userId", "$owner"]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "project_counts",
                                localField: "_id",
                                foreignField: "project_id",
                                as: "counts"
                            }
                        }
                    ],
                    as: "projects"
                }
            },
            {
                $project: {
                    email: "$email",
                    created_at: "$created_at",
                    premium_type: {
                        $arrayElemAt: [
                            "$premiums.premium_type",
                            0
                        ]
                    },
                    limit: {
                        $arrayElemAt: ["$limits.limit", 0]
                    },
                    visits: {
                        $arrayElemAt: ["$limits.visits", 0]
                    },
                    events: {
                        $arrayElemAt: ["$limits.events", 0]
                    },
                    projects: 1
                }
            },
            {
                $sort: getSortQuery()
            },
            {
                $skip: skipValue
            },
            {
                $limit: limitValue
            }
        ])
    }



    const count = await UserModel.countDocuments({
        created_at: {
            $gte: new Date(from as string),
            $lte: new Date(to as string),
        }
    });

    return { users, count } as { users: TAdminUser[], count: number };

});