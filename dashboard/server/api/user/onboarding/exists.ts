
import { OnboardingModel } from '@schema/OnboardingSchema';

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'flag:allowAnonRegistered');

    const exists = await OnboardingModel.exists({ user_id: ctx.user_id });

    return { exists: exists != null }

});