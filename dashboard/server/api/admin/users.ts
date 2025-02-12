import { TProject } from "@schema/project/ProjectSchema";
import { TUser, UserModel } from "@schema/UserSchema";

export type TAdminUser = TUser & { _id: string, projects: TProject[] };

export default defineEventHandler(async event => {
    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const { page, limit, sortQuery, filterQuery } = getQuery(event);

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const count = await UserModel.countDocuments(JSON.parse(filterQuery as string));

    const users = await UserModel.aggregate([
        {
            $match: JSON.parse(filterQuery as string)
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