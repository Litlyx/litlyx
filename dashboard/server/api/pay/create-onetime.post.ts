import { getPlanFromId } from "@data/PREMIUM";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import StripeService from '~/server/services/StripeService';


export default defineEventHandler(async event => {

    const data = await getRequestDataOld(event, { requireSchema: false, allowGuests: false, allowLitlyx: false });
    if (!data) return;

    const { project, pid } = data;

    const body = await readBody(event);

    const { planId } = body;

    const PLAN = getPlanFromId(planId);

    if (!PLAN) {
        console.error('PLAN', planId, 'NOT EXIST');
        return setResponseStatus(event, 400, 'Plan not exist');
    }

    const intent = await StripeService.createOnetimePayment(
        StripeService.testMode ? PLAN.PRICE_TEST : PLAN.PRICE,
        'https://dashboard.litlyx.com/payment_ok',
        pid,
        project.customer_id
    )

    if (!intent) {
        console.error('Cannot create Intent', { plan: PLAN });
        return setResponseStatus(event, 400, 'Cannot create intent');
    }

    return intent.url;

});