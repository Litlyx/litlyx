
import { OnboardingModel } from '@schema/OnboardingSchema';

export default defineEventHandler(async event => {
    const data = await getRequestData(event);
    if (!data) return;

    const exist = await OnboardingModel.exists({ user_id: data.user.id });

    return { exist: exist != null }
});