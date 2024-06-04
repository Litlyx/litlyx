
import StripeService from '~/server/services/StripeService';
import type Event from 'stripe';
import { ProjectModel } from '@schema/ProjectSchema';
import { PREMIUM_LIMITS, getPlanFromPremiumTag, getPlanTagFromStripePrice } from '@data/PREMIUM_LIMITS';
import { ProjectCountModel } from '@schema/ProjectsCounts';

async function onPaymentSuccess(event: Event.InvoicePaidEvent) {

    if (event.data.object.status === 'paid') {

        const pid = event.data.object.subscription_details?.metadata?.pid;

        const project = await ProjectModel.findById(pid);
        if (!project) return { error: 'Project not found' }

        const subscriptionId = event.data.object.subscription;
        if (!subscriptionId) return { error: 'SubscriptionId not found' }

        const price = event.data.object.lines.data[0].plan?.id;
        if (!price) return { error: 'Price not found' }

        const premiumTag = getPlanTagFromStripePrice(price);
        if (!premiumTag) return { error: 'Premium tag not found' }

        const plan = getPlanFromPremiumTag(premiumTag);
        if (!plan) return { error: 'Plan not found' }

        await ProjectModel.updateOne({ _id: pid }, {
            premium: true,
            customer_id: event.data.object.customer,
            premium_type: plan.id,
            premium_expire_at: event.data.object.lines.data[0].period.end * 1000
        });

        const limits = PREMIUM_LIMITS[premiumTag];

        await ProjectCountModel.create({
            project_id: project._id,
            events: 0,
            visits: 0,
            ai_messages: 0,
            limit: limits.COUNT_LIMIT,
            ai_limit: limits.AI_MESSAGE_LIMIT,
            billing_start_at: event.data.object.lines.data[0].period.start * 1000,
            billing_expire_at: event.data.object.lines.data[0].period.end * 1000,
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

async function onSubscriptionUpdated(event: Event.CustomerSubscriptionUpdatedEvent) {
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
    if (eventData.type === 'customer.subscription.updated') return await onSubscriptionUpdated(eventData);

    return { received: true }
});