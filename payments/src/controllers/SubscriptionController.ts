
import StripeService from '../services/StripeService';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { addSubscriptionToUser } from './WebhookController';
import { getPlanFromTag } from '../shared/data/PLANS';
import { PremiumModel } from '../shared/schema/PremiumSchema';


export const ZActivatePlanInput = z.object({
    user_id: z.string(),
    customer_id: z.string(),
    plan_tag: z.string()
})

export type TActivatePlanInput = z.infer<typeof ZActivatePlanInput>;

export async function activatePlan(data: TActivatePlanInput) {
    try {

        const exists = await PremiumModel.exists({ user_id: data.user_id });

        if (!exists) {
            await PremiumModel.create({ 
                user_id: data.user_id, 
                customer_id: data.customer_id, 
                subscription_id: 'DUMMY',
                expire_at: Date.now() + 1000 * 60 * 60 * 24,
             });
        }

        const subscription = await StripeService.createSubscription(data.customer_id, data.plan_tag);
        if (!subscription) {
            await PremiumModel.deleteOne({ user_id: data.user_id, customer_id: data.customer_id });
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Cannot create subscription. Please contact support.' });
        }

        const plan = getPlanFromTag(data.plan_tag as any);
        if (!plan) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Cannot get plan. Please contact support.' });

        await addSubscriptionToUser(data.user_id,
            plan,
            subscription.id,
            subscription.items.data[0].current_period_start,
            subscription.items.data[0].current_period_end
        );

        return { ok: true }
    } catch (ex) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: ex.message });
    }
}



export const ZCreateCheckoutInput = z.object({
    user_id: z.string(),
    customer_id: z.string(),
    plan_tag: z.string(),
    redirect_url: z.string()
})


export type TCreateCheckoutInput = z.infer<typeof ZCreateCheckoutInput>;

export async function createCheckout(data: TCreateCheckoutInput) {
    try {

        const plan = getPlanFromTag(data.plan_tag as any);
        if (!plan) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot find plan' });

        const premiumData = await PremiumModel.findOne({ user_id: data.user_id, customer_id: data.customer_id });
        if (!premiumData) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot find premium data' });

        const price = StripeService.testMode ? plan.PRICE_TEST : plan.PRICE;

        const checkout = await StripeService.createPayment(price, data.redirect_url, data.user_id, data.customer_id);
        if (!checkout) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Cannot create checkout' });

        return checkout.url;

    } catch (ex) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: ex.message });
    }
}


export const ZCreatePreviewUpgradeInput = z.object({
    user_id: z.string(),
    customer_id: z.string(),
    plan_tag: z.string()
})


export type TCreatePreviewUpgradeInput = z.infer<typeof ZCreatePreviewUpgradeInput>;

export async function createPreviewUpgrade(data: TCreatePreviewUpgradeInput) {
    try {

        const plan = getPlanFromTag(data.plan_tag as any);
        if (!plan) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot find plan' });

        const premiumData = await PremiumModel.findOne({ user_id: data.user_id, customer_id: data.customer_id });
        if (!premiumData) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot find premium data' });


        const preview = await StripeService.getPreviewUpgrade(premiumData.customer_id, premiumData.subscription_id, plan.TAG);
        if (!preview) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Cannot create preview' });

        return preview;

    } catch (ex) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: ex.message });
    }
}


export const ZCreateUpgradeInput = z.object({
    user_id: z.string(),
    customer_id: z.string(),
    plan_tag: z.string()
})


export type TCreateUpgradeInput = z.infer<typeof ZCreateUpgradeInput>;

export async function createUpgrade(data: TCreateUpgradeInput) {
    try {

        const plan = getPlanFromTag(data.plan_tag as any);
        if (!plan) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot find plan' });

        const premiumData = await PremiumModel.findOne({ user_id: data.user_id, customer_id: data.customer_id });
        if (!premiumData) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot find premium data' });


        const result = await StripeService.updateSubscriptionWithPrice(data.customer_id, premiumData.subscription_id, data.plan_tag);
        return result;

    } catch (ex) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: ex.message });
    }
}




export const ZCancelPlanInput = z.object({
    user_id: z.string(),
    customer_id: z.string()
})


export type TCancelPlanInput = z.infer<typeof ZCancelPlanInput>;

export async function cancelPlan(data: TCancelPlanInput) {
    try {

        const premiumData = await PremiumModel.findOne({ user_id: data.user_id, customer_id: data.customer_id });
        if (!premiumData) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot find premium data' });

        await StripeService.cancelPlan(data.customer_id);
        await PremiumModel.updateOne({ user_id: data.user_id, customer_id: data.customer_id }, { plan_cancelled: true });

        return { ok: true }

    } catch (ex) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: ex.message });
    }
}