import { getPlanFromId, PREMIUM_PLAN } from "@data/PLANS";
import { canTryAppsumoCode, checkAppsumoCode, useAppsumoCode, useTryAppsumoCode } from "~/server/services/AppsumoService";
import { PaymentServiceHelper } from "~/server/services/PaymentServiceHelper";
import { PremiumModel } from "~/shared/schema/PremiumSchema";


function getPlanToActivate(current_plan_id: number) {
    if (current_plan_id === PREMIUM_PLAN.FREE.ID) {
        return PREMIUM_PLAN.APPSUMO_INCUBATION;
    }
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

    const currentPremiumData = await PremiumModel.findOne({ user_id: user.id });
    if (!currentPremiumData) return setResponseStatus(event, 400, 'Error finding user');

    const currentPlan = getPlanFromId(currentPremiumData.premium_type);
    if (!currentPlan) return setResponseStatus(event, 400, 'Current plan not found');

    const planToActivate = getPlanToActivate(currentPlan.ID);
    if (!planToActivate) return setResponseStatus(event, 400, 'Cannot use code on current plan');

    const sub = await PaymentServiceHelper.create_subscription(user.id, planToActivate.TAG);
    console.log(sub);

    await useAppsumoCode(pid, code);

});