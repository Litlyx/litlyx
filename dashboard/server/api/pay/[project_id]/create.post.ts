import { PREMIUM_PLANS, STRIPE_PLANS } from "@data/PREMIUM_LIMITS";
import { ProjectModel } from "@schema/ProjectSchema";
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

    const plan = PREMIUM_PLANS.find(e => e.id == planId);

    if (!plan) {
        console.error('PLAN', planId, 'NOT EXIST');
        return setResponseStatus(event, 400, 'Plan not exist');
    }

    const { price } = STRIPE_PLANS[plan.tag];

    const checkout = await StripeService.cretePayment(
        price,
        'https://dashboard.litlyx.com/payment_ok',
        project.customer_id
    );

    if (!checkout) {
        console.error('Cannot create payment', { plan, price });
        return setResponseStatus(event, 400, 'Cannot create payment');
    }

    const customer = checkout.customer;
    await ProjectModel.updateOne({ _id: project_id }, { customer_id: customer });

    return checkout.url;

});