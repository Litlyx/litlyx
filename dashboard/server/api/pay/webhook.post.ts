
import StripeService from '~/server/services/StripeService';
import type Event from 'stripe';
import { ProjectModel } from '@schema/ProjectSchema';
import { PREMIUM_LIMITS, getPlanFromPremiumTag, getPlanTagFromStripePrice } from '@data/PREMIUM_LIMITS';
import { ProjectCountModel } from '@schema/ProjectsCounts';

async function onPaymentSuccess(event: Event.InvoicePaidEvent) {

    if (event.data.object.status === 'paid') {
        const customer = event.data.object.customer;

        const project = await ProjectModel.findOne({ customer_id: customer });
        if (!project) return { error: 'Project not found' }

        const subscriptionId = event.data.object.subscription;
        if (!subscriptionId) return { error: 'SubscriptionId not found' }

        const subscription = await StripeService.getSubscription(subscriptionId as string);
        if (!subscription) return { error: 'Subscription not found' }

        const price = subscription.items.data[0].plan.id;

        
        const premiumTag = getPlanTagFromStripePrice(price);
        if (!premiumTag) return { error: 'Premium tag not found' }

        const plan = getPlanFromPremiumTag(premiumTag);
        if (!plan) return { error: 'Plan not found' }

        await ProjectModel.updateOne({ customer_id: customer }, {
            premium: true,
            premium_type: plan.id,
            premium_expire_at: subscription.current_period_end
        });

        const limits = PREMIUM_LIMITS[premiumTag];

        await ProjectCountModel.create({
            project_id: project._id,
            events: 0,
            visits: 0,
            ai_messages: 0,
            limit: limits.COUNT_LIMIT,
            ai_limit: limits.AI_MESSAGE_LIMIT,
            billing_start_at: subscription.current_period_start,
            billing_expire_at: subscription.current_period_end,
        });

        return { ok: true }
    }

    return { received: true }
}

async function onSubscriptionCreated(event: Event.CustomerSubscriptionCreatedEvent) {
    return { received: true }
}

async function onSubscriptionDeleted(event: Event.CustomerSubscriptionDeletedEvent) {
    return { received: true }
}


export default defineEventHandler(async event => {
    
    const body = await readRawBody(event);
    const signature = getHeader(event, 'stripe-signature') || '';

    const eventData = StripeService.parseWebhook(body, signature);
    if (!eventData) return;
    if (eventData.type === 'invoice.paid') return await onPaymentSuccess(eventData);
    if (eventData.type === 'customer.subscription.deleted') return await onSubscriptionDeleted(eventData);
    if (eventData.type === 'customer.subscription.created') return await onSubscriptionCreated(eventData);

    return { received: true }
});