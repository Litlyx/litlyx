
import type Event from 'stripe';
import StripeService from '../services/StripeService';
import { getPlanFromPrice, getPlanFromTag, PLAN_DATA } from '../shared/data/PLANS';
import { PremiumModel } from '../shared/schema/PremiumSchema';
import { UserLimitModel } from '../shared/schema/UserLimitSchema';
import { email_client } from '../trcp_client';
import { UserModel } from '../shared/schema/UserSchema';
import { EmailNotifyModel } from '../shared/schema/emails/EmailNotifySchema';
import mongoose from 'mongoose';
import crypto from 'crypto';



export async function addSubscriptionToUser(user_id: string, plan: PLAN_DATA, subscription_id: string, current_period_start: number, current_period_end: number, payment_failed: boolean = false) {

    console.log('Adding subscription to user', user_id, 'plan', plan.TAG, 'start', new Date(current_period_start * 1000).toLocaleString('it-IT'), 'end', new Date(current_period_end * 1000).toLocaleString('it-IT'));

    await PremiumModel.updateOne({ user_id }, {
        premium_type: plan.ID,
        subscription_id,
        expire_at: current_period_end * 1000,
        plan_cancelled: false,
        payment_failed
    }, { upsert: true });

    await UserLimitModel.updateOne({ user_id }, {
        events: 0,
        visits: 0,
        ai_messages: 0,
        limit: plan.COUNT_LIMIT,
        ai_limit: plan.AI_MESSAGE_LIMIT,
        billing_start_at: current_period_start * 1000,
        billing_expire_at: current_period_end * 1000,
    }, { upsert: true })

}

export async function onPaymentFailed(event: Event.InvoicePaymentFailedEvent) {


    if (event.data.object.attempt_count == 0) return { received: true, warn: 'attempt_count = 0' }

    //TODO: Send emails

    const customer_id = event.data.object.customer as string;

    const premiumData = await PremiumModel.findOne({ customer_id });
    if (!premiumData) return { error: 'customer not found' }

    await PremiumModel.updateOne({ customer_id }, { payment_failed: true });

    return { ok: true }
}


export async function onPaymentSuccess(event: Event.InvoicePaidEvent) {


    // Check selfhosted

    const selfhostedProPrice = (event.data.object.lines.data.at(-1)?.pricing?.price_details?.price as string) === getPlanFromTag('SELFHOSTED_PRO')?.PRICE;

    if (selfhostedProPrice) {

        const code = crypto.randomBytes(4).toString('hex');

        const email = event.data.object.customer_email;

        if (!email) return { ok: false, data: 'selfhosted-pro', error: 'customer_email is undefined' }

        await mongoose.connection.getClient().db('selfhosted-data').collection('pro-codes').insertOne({
            code,
            created_at: new Date(),
            email
        })

        email_client.email.sendPurchaseSelfhostedEmail.mutate({ code, email });

        return { ok: true, data: 'selfhosted-pro' };
    }


    const customer_id = event.data.object.customer as string;
    const premiumData = await PremiumModel.findOne({ customer_id });
    if (!premiumData) return { error: 'customer not found' }

    if (event.data.object.status !== 'paid') return { received: true, warn: 'payment status not paid' }

    const subscription_id = event.data.object.lines.data[0].subscription as string;

    const price = event.data.object.lines.data.at(-1)?.pricing?.price_details?.price as string;
    if (!price) return { error: 'price not found' }

    const plan = getPlanFromPrice(price, StripeService.testMode ?? true);
    if (!plan) return { error: 'plan not found' }

    const databaseSubscription = premiumData.subscription_id;

    const currentSubscriptionData = await StripeService.getSubscription(subscription_id);
    if (!currentSubscriptionData || currentSubscriptionData.status !== 'active') return { error: 'subscription not active' }

    const FREE_TRIAL_PRICE = StripeService.testMode ? getPlanFromTag('FREE_TRIAL_LITLYX_PRO')?.PRICE_TEST : getPlanFromTag('FREE_TRIAL_LITLYX_PRO')?.PRICE;
    if (!FREE_TRIAL_PRICE) return { error: 'FREE_TRIAL_PRICE not found' }


    if (currentSubscriptionData.items.data[0].price.id === FREE_TRIAL_PRICE) {
        // Free trial

        if (premiumData.expire_at < Date.now()) {
            // Free trial renew -> Free trial ended

            try {
                await StripeService.deleteSubscription(databaseSubscription);
            } catch (ex) {
                console.error(ex);
            }
            const trialEndedSubscription = await StripeService.createSubscription(premiumData.customer_id, 'FREE_TRIAL_ENDED');

            setTimeout(async () => {
                // FREE TRIAL ENDED MAIL
                const user = await UserModel.findOne({ _id: premiumData.user_id });
                if (!user) return { ok: false, error: 'CANNOT_FIND_USER' };
                const limitNotifies = await EmailNotifyModel.findOne({ user_id: premiumData.user_id });
                if (!limitNotifies) return { ok: false, error: 'CANNOT_FIND_LIMIT_NOTIFIES' };
                if (limitNotifies.n6) return { ok: false, error: 'ALREADY_SENDED' };
                await email_client.email.send_trial_6_ended.mutate({ email: user.email })
                await EmailNotifyModel.updateOne({ user_id: premiumData.user_id }, { n6: true });
            }, 1);

            return { ok: true, action: 'FREE_TRIAL_ENDED', expired_at: new Date(premiumData.expire_at).toLocaleString('it-IT') };

        } else {
            // Free trial activate
            return { ok: true, info: 'FREE_TRIAL_SUBSCRIPTION_ACTIVATED' };
        }


    } else {

        // Other subscriptions

        if (databaseSubscription != subscription_id) {
            try {
                await StripeService.deleteSubscription(databaseSubscription);
            } catch (ex) {
                console.error(ex);
            }
        }

        const start_period = event.data.object.billing_reason === 'subscription_create' ? event.data.object.lines.data[0].period.start :

            (event.data.object.lines.data.length == 1 ? event.data.object.lines.data[0].period.start : event.data.object.lines.data[1].period.start)

        const end_period = event.data.object.billing_reason === 'subscription_create' ? event.data.object.lines.data[0].period.end :
            (event.data.object.lines.data.length == 1 ? event.data.object.lines.data[0].period.end : event.data.object.lines.data[1].period.end)

        await addSubscriptionToUser(premiumData.user_id.toString(), plan, subscription_id,
            start_period,
            end_period
        );

        setTimeout(async () => {
            if (plan.ID == 7999) return;
            if (plan.ID == 0) return;
            if (plan.ID === premiumData.premium_type) return;
            // PURCHASE
            const user = await UserModel.findOne({ _id: premiumData.user_id });
            if (!user) {
                console.log({ ok: false, error: 'CANNOT_FIND_USER' });
                return { ok: false, error: 'CANNOT_FIND_USER' };
            }
            await email_client.email.sendPurchaseEmail.mutate({ email: user.email });
        }, 1);

        return { ok: true, action: 'Add subscription ' + plan.TAG };
    }

}