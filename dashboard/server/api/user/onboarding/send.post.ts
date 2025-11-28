
import { OnboardingModel } from '@schema/OnboardingSchema';

export default defineEventHandler(async event => {

    //TODO: SELFHOST - Disable onboarding

    const ctx = await getRequestContext(event);

    const { job, analytics } = await readBody(event);

    await OnboardingModel.updateOne({
        user_id: ctx.user_id,
    }, { job, analytics }, { upsert: true });

    return { ok: true }

});