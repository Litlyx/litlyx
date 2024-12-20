
import { OnboardingModel } from '@schema/OnboardingSchema';

export default defineEventHandler(async event => {
    const data = await getRequestData(event);
    if (!data) return;

    const { job, analytics } = await readBody(event);


    const save = await OnboardingModel.create({
        user_id: data.user.id,
        job,
        analytics
    });

    return { ok: true }

});