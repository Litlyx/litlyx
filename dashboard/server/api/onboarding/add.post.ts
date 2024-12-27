
import { OnboardingModel } from '@schema/OnboardingSchema';

export default defineEventHandler(async event => {
    const data = await getRequestData(event);
    if (!data) return;

    const { job, analytics } = await readBody(event);


    const save = await OnboardingModel.updateOne({
        user_id: data.user.id,
    }, { job, analytics }, { upsert: true });
    return { ok: true }

});