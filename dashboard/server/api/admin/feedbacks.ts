
import { FeedbackModel } from '@schema/FeedbackSchema';

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const feedbacks = await FeedbackModel.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $lookup: {
                from: 'projects',
                localField: 'project_id',
                foreignField: '_id',
                as: 'project'
            }
        },
    ])

    return feedbacks;

});