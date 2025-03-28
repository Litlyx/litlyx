
import type Event from 'stripe';
import StripeService from '../services/StripeService';
import { getPlanFromPrice, PLAN_DATA } from '../shared/data/PLANS';
import { PremiumModel } from '../shared/schema/PremiumSchema';
import { UserLimitModel } from '../shared/schema/UserLimitSchema';

import { EmailService } from '../shared/services/EmailService';



async function addSubscriptionToUser(user_id: string, plan: PLAN_DATA, subscription_id: string, current_period_start: number, current_period_end: number) {

    await PremiumModel.updateOne({ _id: user_id }, {
        premium_type: plan.ID,
        subscription_id,
        expire_at: current_period_end * 1000
    }, { upsert: true });

    await UserLimitModel.updateOne({ _id: user_id }, {
        events: 0,
        visits: 0,
        ai_messages: 0,
        limit: plan.COUNT_LIMIT,
        ai_limit: plan.AI_MESSAGE_LIMIT,
        billing_start_at: current_period_start * 1000,
        billing_expire_at: current_period_end * 1000,
    }, { upsert: true })

}


export async function onPaymentSuccess(event: Event.InvoicePaidEvent) {

    const customer_id = event.data.object.customer;
    const premiumData = await PremiumModel.findOne({ customer_id });
    if (!premiumData) return { error: 'customer not found' }

    if (event.data.object.status !== 'paid') return { received: true, warn: 'payment status not paid' }

    const subscription_id = event.data.object.subscription as string;

    const price = event.data.object.lines.data[0].price.id;
    if (!price) return { error: 'price not found' }

    const plan = getPlanFromPrice(price, StripeService.testMode);
    if (!plan) return { error: 'plan not found' }

    const databaseSubscription = premiumData.subscription_id;

    if (databaseSubscription != subscription_id) {
        await StripeService.deleteSubscription(subscription_id);
    }

    await addSubscriptionToUser(premiumData.user_id.toString(), plan, subscription_id, event.data.object.period_start, event.data.object.period_end);

    setTimeout(() => {
        if (plan.ID == 0) return;
        //TODO: Email service template
        // const emailData = EmailService.getEmailServerInfo('purchase', { target: user.email, projectName: project.name });
        // EmailServiceHelper.sendEmail(emailData);
    }, 1);

    return { ok: true };

}