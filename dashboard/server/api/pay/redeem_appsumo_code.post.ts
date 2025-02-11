import { getPlanFromId, PREMIUM_PLAN } from "@data/PREMIUM";
import { canTryAppsumoCode, checkAppsumoCode, useAppsumoCode, useTryAppsumoCode } from "~/server/services/AppsumoService";
import StripeService from '~/server/services/StripeService';

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

    const data = await getRequestData(event, []);
    if (!data) return;

    const { project, pid, user } = data;

    const body = await readBody(event);

    const { code } = body;

    const canTry = await canTryAppsumoCode(pid);
    if (!canTry) return setResponseStatus(event, 400, 'You tried too much codes. Please contact support.');
    await useTryAppsumoCode(pid, code);

    const valid = await checkAppsumoCode(code);
    if (!valid) return setResponseStatus(event, 400, 'Code not valid');

    const currentPlan = getPlanFromId(project.premium_type);
    if (!currentPlan) return setResponseStatus(event, 400, 'Current plan not found');
    const planToActivate = getPlanToActivate(currentPlan.ID);
    if (!planToActivate) return setResponseStatus(event, 400, 'Cannot use code on current plan');

    await StripeService.createSubscription(project.customer_id, planToActivate.ID);

    await useAppsumoCode(pid, code);

});