
import { TeamMemberModel } from "@schema/TeamMemberSchema";
import { Types } from "mongoose";

export type TPendingInvite = {
    _id: string,
    project_id: string,
    user_id: string,
    role: string,
    pending: boolean,
    creted_at: string,
    project_name: string
};

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');
    const { user_id, user_email } = ctx;

    const members = await TeamMemberModel.aggregate([
        {
            $match:
            {
                $or: [
                    { user_id: new Types.ObjectId(user_id) },
                    { email: user_email }
                ],
                pending: true
            }
        },
        {
            $lookup: {
                from: 'projects',
                as: 'project',
                foreignField: '_id',
                localField: 'project_id',
            }
        },
        {
            $addFields: {
                project_name: { $arrayElemAt: ["$project.name", 0] }
            }
        },
        {
            $project: {
                project: 0
            }
        }
    ]);

    return members;

});