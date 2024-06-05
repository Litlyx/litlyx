
import StripeService from '~/server/services/StripeService';
import type Event from 'stripe';
import { ProjectModel } from '@schema/ProjectSchema';
import { PREMIUM_PLAN, getPlanFromPrice } from '@data/PREMIUM';
import { ProjectCountModel } from '@schema/ProjectsCounts';
import { ProjectLimitModel } from '@schema/ProjectsLimits';
import { UserModel } from '@schema/UserSchema';

async function onPaymentSuccess(event: Event.InvoicePaidEvent) {

    // if (event.data.object.status === 'paid') {

    //     const data = event.data.object;

    //     const pid = data.subscription_details?.metadata?.pid;
    //     if (!pid) return { error: 'ProjectId not found' }

    //     const project = await ProjectModel.findById(pid);
    //     if (!project) return { error: 'Project not found' }

    //     const price = data.lines.data[0].plan?.id;
    //     if (!price) return { error: 'Price not found' }

    //     const PLAN = getPlanFromPrice(price);
    //     if (!PLAN) return { error: 'Plan not found' }

    //     await ProjectModel.updateOne({ _id: pid }, {
    //         premium: true,
    //         customer_id: data.customer,
    //         premium_type: PLAN.ID,
    //         premium_expire_at: data.lines.data[0].period.end * 1000
    //     });

    //     await ProjectCountModel.create({
    //         project_id: project._id,
    //         events: 0,
    //         visits: 0,
    //         ai_messages: 0,
    //         limit: PLAN.COUNT_LIMIT,
    //         ai_limit: PLAN.AI_MESSAGE_LIMIT,
    //         billing_start_at: event.data.object.lines.data[0].period.start * 1000,
    //         billing_expire_at: event.data.object.lines.data[0].period.end * 1000,
    //     });

    //     return { ok: true }
    // }

    return { received: true }
}

async function onSubscriptionCreated(event: Event.CustomerSubscriptionCreatedEvent) {

    const project = await ProjectModel.findOne({ customer_id: event.data.object.customer });
    if (!project) return { error: 'Project not found' }

    const price = event.data.object.items.data[0].price.id;
    if (!price) return { error: 'Price not found' }

    const PLAN = getPlanFromPrice(price);
    if (!PLAN) return { error: 'Plan not found' }


    if (project.subscription_id != event.data.object.id) {
        await StripeService.deleteSubscription(project.subscription_id);
    }

    project.premium = PLAN.ID != 0;
    project.premium_type = PLAN.ID;
    project.subscription_id = event.data.object.id;
    project.premium_expire_at = new Date(event.data.object.current_period_end * 1000);

    await Promise.all([

        project.save(),

        ProjectLimitModel.updateOne({ project_id: project._id }, {
            events: 0,
            visits: 0,
            ai_messages: 0,
            limit: PLAN.COUNT_LIMIT,
            ai_limit: PLAN.AI_MESSAGE_LIMIT,
            billing_start_at: event.data.object.current_period_start * 1000,
            billing_expire_at: event.data.object.current_period_end * 1000,
        }, { upsert: true })

    ]);

    return { ok: true }
}

async function onSubscriptionDeleted(event: Event.CustomerSubscriptionDeletedEvent) {

    const project = await ProjectModel.findOne({
        customer_id: event.data.object.customer,
        subscription_id: event.data.object.id
    });

    if (!project) return { error: 'Project not found' }

    const PLAN = PREMIUM_PLAN['FREE'];

    const targetCustomer = await StripeService.getCustomer(project.customer_id);

    let customer: Event.Customer;

    if (!targetCustomer.deleted) {
        customer = targetCustomer;
    } else {
        const user = await UserModel.findById(project._id, { email: 1 });
        if (!user) return { error: 'User not found' }
        const newCustomer = await StripeService.createCustomer(user.email);
        customer = newCustomer;
    }

    const freeSubscription = await StripeService.createFreeSubscription(customer.id);


    project.premium = false;
    project.premium_type = PLAN.ID;
    project.subscription_id = freeSubscription.id;
    project.premium_expire_at = new Date(freeSubscription.current_period_end * 1000);


    await Promise.all([

        project.save(),

        ProjectLimitModel.updateOne({ project_id: project._id }, {
            events: 0,
            visits: 0,
            ai_messages: 0,
            limit: PLAN.COUNT_LIMIT,
            ai_limit: PLAN.AI_MESSAGE_LIMIT,
            billing_start_at: event.data.object.current_period_start * 1000,
            billing_expire_at: event.data.object.current_period_end * 1000,
        }, { upsert: true })

    ]);

    return { ok: true }
}

async function onSubscriptionUpdated(event: Event.CustomerSubscriptionUpdatedEvent) {

    const project = await ProjectModel.findOne({
        customer_id: event.data.object.customer,
        subscription_id: event.data.object.id
    });

    if (!project) return { error: 'Project not found' }

    const price = event.data.object.items.data[0].price.id;
    if (!price) return { error: 'Price not found' }

    const PLAN = getPlanFromPrice(price);
    if (!PLAN) return { error: 'Plan not found' }

    project.premium = PLAN.ID != 0;
    project.premium_type = PLAN.ID;
    project.subscription_id = event.data.object.id;
    project.premium_expire_at = new Date(event.data.object.current_period_end * 1000);

    await Promise.all([

        project.save(),

        ProjectLimitModel.updateOne({ project_id: project._id }, {
            events: 0,
            visits: 0,
            ai_messages: 0,
            limit: PLAN.COUNT_LIMIT,
            ai_limit: PLAN.AI_MESSAGE_LIMIT,
            billing_start_at: event.data.object.current_period_start * 1000,
            billing_expire_at: event.data.object.current_period_end * 1000,
        }, { upsert: true })

    ]);

    return { ok: true }
}




export default defineEventHandler(async event => {

    const body = await readRawBody(event);
    const signature = getHeader(event, 'stripe-signature') || '';

    const eventData = StripeService.parseWebhook(body, signature);
    if (!eventData) return;
    if (eventData.type === 'invoice.paid') return await onPaymentSuccess(eventData);
    if (eventData.type === 'customer.subscription.deleted') return await onSubscriptionDeleted(eventData);
    if (eventData.type === 'customer.subscription.created') return await onSubscriptionCreated(eventData);
    if (eventData.type === 'customer.subscription.updated') return await onSubscriptionUpdated(eventData);

    return { received: true }
});