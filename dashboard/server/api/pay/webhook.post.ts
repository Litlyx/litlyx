
import StripeService from '~/server/services/StripeService';
import type Event from 'stripe';
import { ProjectModel } from '@schema/ProjectSchema';
import { PREMIUM_DATA, PREMIUM_PLAN, getPlanFromId, getPlanFromPrice, getPlanFromTag } from '@data/PREMIUM';
import { ProjectLimitModel } from '@schema/ProjectsLimits';



async function addSubscriptionToProject(project_id: string, plan: PREMIUM_DATA, subscription_id: string, current_period_start: number, current_period_end: number) {

    await ProjectModel.updateOne({ _id: project_id }, {
        premium: plan.ID != 0,
        premium_type: plan.ID,
        subscription_id,
        premium_expire_at: current_period_end * 1000
    });

    await ProjectLimitModel.updateOne({ project_id }, {
        events: 0,
        visits: 0,
        ai_messages: 0,
        limit: plan.COUNT_LIMIT,
        ai_limit: plan.AI_MESSAGE_LIMIT,
        billing_start_at: current_period_start * 1000,
        billing_expire_at: current_period_end * 1000,
    }, { upsert: true })

}



async function onPaymentFailed(event: Event.InvoicePaymentFailedEvent) {

    //TODO: Send emails

    if (event.data.object.attempt_count > 1) {
        const customer_id = event.data.object.customer as string;
        const project = await ProjectModel.findOne({ customer_id });
        if (!project) return { error: 'CUSTOMER NOT EXIST' }

        const allSubscriptions = await StripeService.getAllSubscriptions(customer_id);
        if (!allSubscriptions) return;

        for (const subscription of allSubscriptions.data) {
            await StripeService.deleteSubscription(subscription.id);
        }

        const freeSub = await StripeService.createFreeSubscription(customer_id);
        if (!freeSub) return;

        await addSubscriptionToProject(
            project._id.toString(),
            getPlanFromTag('FREE'),
            freeSub.id,
            freeSub.current_period_start,
            freeSub.current_period_end
        )

        return { ok: true };
    }


}

async function onPaymentSuccess(event: Event.InvoicePaidEvent) {

    const customer_id = event.data.object.customer as string;
    const project = await ProjectModel.findOne({ customer_id });
    if (!project) return { error: 'CUSTOMER NOT EXIST' }


    if (event.data.object.status === 'paid') {

        const subscription_id = event.data.object.subscription as string;

        const allSubscriptions = await StripeService.getAllSubscriptions(customer_id);
        if (!allSubscriptions) return;
        
        const currentSubscription = allSubscriptions.data.find(e => e.id === subscription_id);
        if (!currentSubscription) return { error: 'SUBSCRIPTION NOT EXIST' }

        if (currentSubscription.status !== 'active') return { error: 'SUBSCRIPTION NOT ACTIVE' }

        for (const subscription of allSubscriptions.data) {
            if (subscription.id === subscription_id) continue;
            await StripeService.deleteSubscription(subscription.id);
        }

        const price = currentSubscription.items.data[0].price.id;
        if (!price) return { error: 'Price not found' }

        const PLAN = getPlanFromPrice(price, StripeService.testMode || false);
        if (!PLAN) return { error: 'Plan not found' }

        await addSubscriptionToProject(project._id.toString(), PLAN, subscription_id, currentSubscription.current_period_start, currentSubscription.current_period_end)

        return { ok: true };


    }
    return { received: true, warn: 'payment status not paid' }
}



async function onSubscriptionCreated(event: Event.CustomerSubscriptionCreatedEvent) {

    // const project = await ProjectModel.findOne({ customer_id: event.data.object.customer });
    // if (!project) return { error: 'CUSTOMER NOT EXIST' }

    // const price = event.data.object.items.data[0].price.id;
    // if (!price) return { error: 'Price not found' }

    // const PLAN = getPlanFromPrice(price, StripeService.testMode || false);
    // if (!PLAN) return { error: 'Plan not found' }

    // if (project.subscription_id != event.data.object.id) {
    //     try {
    //         await StripeService.deleteSubscription(project.subscription_id);
    //     } catch (ex) { }
    // }


    // if (event.data.object.status === 'active') {
    //     await addSubscriptionToProject(
    //         project._id.toString(),
    //         PLAN,
    //         event.data.object.id,
    //         event.data.object.current_period_start,
    //         event.data.object.current_period_end
    //     );
    // }



    return { ok: true }
}

async function onSubscriptionDeleted(event: Event.CustomerSubscriptionDeletedEvent) {

    // const project = await ProjectModel.findOne({
    //     customer_id: event.data.object.customer,
    //     subscription_id: event.data.object.id
    // });

    // if (!project) return { error: 'PROJECT WITH SUBSCRIPTION NOT FOUND' }

    // const targetCustomer = await StripeService.getCustomer(project.customer_id);

    // let customer: Event.Customer;

    // if (!targetCustomer.deleted) {
    //     customer = targetCustomer;
    // } else {
    //     const user = await UserModel.findById(project._id, { email: 1 });
    //     if (!user) return { error: 'User not found' }
    //     const newCustomer = await StripeService.createCustomer(user.email);
    //     customer = newCustomer;
    // }

    // await StripeService.createFreeSubscription(customer.id);

    return { received: true }
}

async function onSubscriptionUpdated(event: Event.CustomerSubscriptionUpdatedEvent) {

    // const project = await ProjectModel.findOne({
    //     customer_id: event.data.object.customer,
    // });

    // if (!project) return { error: 'Project not found' }

    // const price = event.data.object.items.data[0].price.id;
    // if (!price) return { error: 'Price not found' }

    // const PLAN = getPlanFromPrice(price, StripeService.testMode || false);
    // if (!PLAN) return { error: 'Plan not found' }

    // if (event.data.object.status === 'active') {
    //     await addSubscriptionToProject(
    //         project._id.toString(),
    //         PLAN,
    //         event.data.object.id,
    //         event.data.object.current_period_start,
    //         event.data.object.current_period_end
    //     );
    // }

    return { ok: true }
}




export default defineEventHandler(async event => {

    const body = await readRawBody(event);
    const signature = getHeader(event, 'stripe-signature') || '';

    const eventData = StripeService.parseWebhook(body, signature);
    if (!eventData) return;
    if (eventData.type === 'invoice.paid') return await onPaymentSuccess(eventData);
    if (eventData.type === 'invoice.payment_failed') return await onPaymentFailed(eventData);
    if (eventData.type === 'customer.subscription.deleted') return await onSubscriptionDeleted(eventData);
    if (eventData.type === 'customer.subscription.created') return await onSubscriptionCreated(eventData);
    if (eventData.type === 'customer.subscription.updated') return await onSubscriptionUpdated(eventData);

    return { received: true }
});