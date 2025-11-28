
import { OnboardingModel } from "~/shared/schema/OnboardingSchema";

export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'admin');

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