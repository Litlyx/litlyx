import { getPlanFromId } from "@data/PREMIUM";
import StripeService from '~/server/services/StripeService';


export default defineEventHandler(async event => {

    const data = await getRequestData(event, { requireSchema: false, allowGuests: false, allowLitlyx: false });
    if (!data) return;

    const { project, pid } = data;

    const body = await readBody(event);

    const { planId } = body;

    const PLAN = getPlanFromId(planId);

    if (!PLAN) {
        console.error('PLAN', planId, 'NOT EXIST');
        return setResponseStatus(event, 400, 'Plan not exist');
    }

    const checkout = await StripeService.createPayment(
        StripeService.testMode ? PLAN.PRICE_TEST : PLAN.PRICE,
        'https://dashboard.litlyx.com/payment_ok',
        pid,
        project.customer_id
    );

    if (!checkout) {
        console.error('Cannot create payment', { plan: PLAN });
        return setResponseStatus(event, 400, 'Cannot create payment');
    }

    return checkout.url;

});