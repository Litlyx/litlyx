import { json, Router } from 'express';
import z from 'zod';
import { getPlanFromId } from '../shared/data/PLANS';
import StripeService from '../services/StripeService';
import { sendJson } from '../Utils';
import { PremiumModel } from '../shared/schema/PremiumSchema';
import { Types } from 'mongoose';
import { UserModel } from '../shared/schema/UserSchema';

export const paymentRouter = Router();

export const ZBodyCreateCustomer = z.object({
    user_id: z.string()
});

paymentRouter.post('/create_customer', json(), async (req, res) => {
    try {
        const createCustomerData = ZBodyCreateCustomer.parse(req.body);
        const user = await UserModel.findOne({ _id: createCustomerData.user_id });
        if (!user) return sendJson(res, 400, { error: 'user not found' });

        const customer = await StripeService.createCustomer(user.email);
        const freesub = await StripeService.createFreeSubscription(customer.id);

        await PremiumModel.create({
            user_id: user.id,
            customer_id: customer.id,
            premium_type: 0,
            subscription_id: freesub.id
        })

        return sendJson(res, 200, { ok: true });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});


export const ZBodyCreatePayment = z.object({
    user_id: z.string(),
    plan_id: z.number()
});

paymentRouter.post('/create', json(), async (req, res) => {
    try {
        const createPaymentData = ZBodyCreatePayment.parse(req.body);

        const plan = getPlanFromId(createPaymentData.plan_id);
        if (!plan) return sendJson(res, 400, { error: 'plan not found' });

        const premiumData = await PremiumModel.findOne({ user_id: createPaymentData.user_id });
        if (!premiumData) return sendJson(res, 400, { error: 'user not found' });
        if (!premiumData.customer_id) return sendJson(res, 400, { error: 'user have no customer_id' });

        const price = StripeService.testMode ? plan.PRICE_TEST : plan.PRICE;

        const checkout = await StripeService.createPayment(
            price,
            'https://dashboard.litlyx.com/payment_ok',
            createPaymentData.user_id,
            premiumData.customer_id
        );

        if (!checkout) return sendJson(res, 400, { error: 'cannot create payment' });

        return sendJson(res, 200, { url: checkout.url });

    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});


export const ZBodyInvoicesList = z.object({
    user_id: z.string()
});

paymentRouter.post('/invoices_list', json(), async (req, res) => {
    try {
        const invoicesListData = ZBodyInvoicesList.parse(req.body);

        const premiumData = await PremiumModel.findOne({ user_id: invoicesListData.user_id });
        if (!premiumData) return sendJson(res, 400, { error: 'user not found' });
        if (!premiumData.customer_id) return sendJson(res, 400, { error: 'user have no customer_id' });

        const invoices = await StripeService.getInvoices(premiumData.customer_id);
        return sendJson(res, 200, { invoices: invoices.data });

    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});


export const ZBodyCustomerInfo = z.object({
    user_id: z.string()
});

paymentRouter.post('/customer_info', json(), async (req, res) => {
    try {
        const customerInfoData = ZBodyCustomerInfo.parse(req.body);

        const premiumData = await PremiumModel.findOne({ user_id: customerInfoData.user_id });
        if (!premiumData) return sendJson(res, 400, { error: 'user not found' });
        if (!premiumData.customer_id) return sendJson(res, 400, { error: 'user have no customer_id' });

        const customer = await StripeService.getCustomer(premiumData.customer_id);
        if (!customer) return sendJson(res, 200, {});
        if (customer.deleted === true) return sendJson(res, 200, {});
        return sendJson(res, 200, customer.address);

    } catch (ex) {
        console.error(ex);
        res.status(500).json({ error: ex.message });
    }
});




export const ZBodyUpdateCustomerInfo = z.object({
    user_id: z.string(),
    address: z.object({
        line1: z.string(),
        line2: z.string(),
        city: z.string(),
        country: z.string(),
        postal_code: z.string(),
        state: z.string()
    })
});

paymentRouter.post('/update_customer_info', json(), async (req, res) => {
    try {
        const updateCustomerInfoData = ZBodyUpdateCustomerInfo.parse(req.body);

        const premiumData = await PremiumModel.findOne({ user_id: updateCustomerInfoData.user_id });
        if (!premiumData) return sendJson(res, 400, { error: 'user not found' });
        if (!premiumData.customer_id) return sendJson(res, 400, { error: 'user have no customer_id' });
        await StripeService.setCustomerInfo(
            premiumData.customer_id,
            updateCustomerInfoData.address as any
        );
        return sendJson(res, 200, { ok: true });

    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});


export const ZBodyDeleteCustomer = z.object({
    customer_id: z.string(),
});

paymentRouter.post('/delete_customer', json(), async (req, res) => {
    try {
        const deleteCustomerData = ZBodyDeleteCustomer.parse(req.body);
        await StripeService.deleteCustomer(deleteCustomerData.customer_id);
        return sendJson(res, 200, { ok: true });
    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});


export const ZBodyCreateSubscription = z.object({
    user_id: z.string(),
    plan_tag: z.string()
});

paymentRouter.post('/create_subscription', json(), async (req, res) => {
    try {
        const createSubscriptionData = ZBodyCreateSubscription.parse(req.body);

        const premiumData = await PremiumModel.findOne({ user_id: createSubscriptionData.user_id });
        if (!premiumData) return sendJson(res, 400, { error: 'user not found' });
        if (!premiumData.customer_id) return sendJson(res, 400, { error: 'user have no customer_id' });

        await StripeService.createSubscription(
            premiumData.customer_id,
            createSubscriptionData.plan_tag
        );
        return sendJson(res, 200, { ok: true });

    } catch (ex) {
        console.error(ex);
        res.status(500).json({ error: ex.message });
    }
});