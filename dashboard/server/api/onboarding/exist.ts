
import { OnboardingModel } from '@schema/OnboardingSchema';


const { SELFHOSTED } = useRuntimeConfig();

export default defineEventHandler(async event => {
    const data = await getRequestData(event);
    if (!data) return;

    const exist = await OnboardingModel.exists({ user_id: data.user.id });

    if (SELFHOSTED === 'TRUE' || SELFHOSTED === 'true') {
        return { exists: true }
    }
    return { exist: exist != null }
});