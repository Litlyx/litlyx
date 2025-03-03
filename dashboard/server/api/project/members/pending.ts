
import { TeamMemberModel } from "@schema/TeamMemberSchema";
import { Types } from "mongoose";


export default defineEventHandler(async event => {

    const data = await getRequestData(event);
    if (!data) return;

    const members = await TeamMemberModel.aggregate([
        {
            $match:
            {
                $or: [
                    { user_id: new Types.ObjectId(data.user.id) },
                    { email: data.user.user.email }
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