import { getPlanFromId } from "@data/PREMIUM";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import StripeService from '~/server/services/StripeService';


export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const body = await readBody(event);

    const { planId } = body;

    const PLAN = getPlanFromId(planId);

    if (!PLAN) {
        console.error('PLAN', planId, 'NOT EXIST');
        return setResponseStatus(event, 400, 'Plan not exist');
    }

    const checkout = await StripeService.cretePayment(
        PLAN.PRICE,
        'https://dashboard.litlyx.com/payment_ok',
        project_id,
        project.customer_id
    );

    if (!checkout) {
        console.error('Cannot create payment', { plan: PLAN });
        return setResponseStatus(event, 400, 'Cannot create payment');
    }

    return checkout.url;

});