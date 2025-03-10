import { TProject } from "@schema/project/ProjectSchema";
import { TUser, UserModel } from "@schema/UserSchema";

export type TAdminUser = TUser & { _id: string, projects: TProject[] };

export default defineEventHandler(async event => {
    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const { page, limit, sortQuery, filterQuery, filterFrom, filterTo } = getQuery(event);

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const matchQuery = {
        ...JSON.parse(filterQuery as string),
        created_at: {
            $gte: new Date(filterFrom as string),
            $lte: new Date(filterTo as string)
        }
    }

    
    const count = await UserModel.countDocuments(matchQuery);



    const users = await UserModel.aggregate([
        {
            $match: matchQuery
        },
        {
            $lookup: {
                from: "projects",
                localField: "_id",
                foreignField: "owner",
                as: "projects"
            }
        },
        { $sort: JSON.parse(sortQuery as string) },
        { $skip: pageNumber * limitNumber },
        { $limit: limitNumber }
    ]);

    return { count, users: users as TAdminUser[] }

});