import { getPlanFromId } from "@data/PREMIUM";
import StripeService from '~/server/services/StripeService';
import { PREMIUM_PLAN } from "../../../../shared/data/PREMIUM";
import { checkAppsumoCode, useAppsumoCode } from "~/server/services/AppsumoService";



function getPlanToActivate(current_plan_id: number) {
    if (current_plan_id === PREMIUM_PLAN.FREE.ID) {
        return PREMIUM_PLAN.APPSUMO_INCUBATION;
    }
    // if (current_plan_id === PREMIUM_PLAN.INCUBATION.ID) {
    //     return PREMIUM_PLAN.APPSUMO_ACCELERATION;
    // }
    // if (current_plan_id === PREMIUM_PLAN.ACCELERATION.ID) {
    //     return PREMIUM_PLAN.APPSUMO_GROWTH;
    // }
    if (current_plan_id === PREMIUM_PLAN.APPSUMO_INCUBATION.ID) {
        return PREMIUM_PLAN.APPSUMO_ACCELERATION;
    }
    if (current_plan_id === PREMIUM_PLAN.APPSUMO_ACCELERATION.ID) {
        return PREMIUM_PLAN.APPSUMO_GROWTH;
    }
}

export default defineEventHandler(async event => {

    const data = await getRequestData(event, { requireSchema: false, allowGuests: false, allowLitlyx: false });
    if (!data) return;

    const { project, pid } = data;

    const body = await readBody(event);

    const { code } = body;

    const valid = await checkAppsumoCode(code);

    if (!valid) return setResponseStatus(event, 400, 'Current plan not found');

    const currentPlan = getPlanFromId(project.premium_type);
    if (!currentPlan) return setResponseStatus(event, 400, 'Current plan not found');
    const planToActivate = getPlanToActivate(currentPlan.ID);
    if (!planToActivate) return setResponseStatus(event, 400, 'Cannot use code on current plan');

    await StripeService.deleteSubscription(project.subscription_id);
    await StripeService.createSubscription(project.customer_id, planToActivate.ID);

    await useAppsumoCode(code);

});