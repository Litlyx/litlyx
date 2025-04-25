import { getPlanFromId } from "@data/PLANS";
import { PaymentServiceHelper } from "~/server/services/PaymentServiceHelper";
// import StripeService from '~/server/services/StripeService';


export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], []);
    if (!data) return;

    const { project, pid, user } = data;

    const body = await readBody(event);

    const { planId } = body;
    const PLAN = getPlanFromId(planId);

    if (!PLAN) {
        console.error('PLAN', planId, 'NOT EXIST');
        return setResponseStatus(event, 400, 'Plan not exist');
    }

    const [ok, res] = await PaymentServiceHelper.create_payment(user.id, PLAN.ID);

    if (!ok) {
        console.error('Cannot create payment', { plan: PLAN });
        return setResponseStatus(event, 400, res.message ?? 'Cannot create payment');
    }

    return res.url;

});