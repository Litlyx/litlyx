
import { OnboardingModel } from '~/shared/schema/OnboardingSchema';

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const analytics = await OnboardingModel.aggregate([
        {
            $group: {
                _id: '$analytics',
                count: { $sum: 1 }
            }
        },
    ]);

    const jobs = await OnboardingModel.aggregate([
        {
            $group: {
                _id: '$job',
                count: { $sum: 1 }
            }
        },
    ])

    return { analytics, jobs };

});