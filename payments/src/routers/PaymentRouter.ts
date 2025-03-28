import { json, Router } from 'express';
import z from 'zod';
import { getPlanFromId } from '../shared/data/PLANS';
import StripeService from '../services/StripeService';
import { sendJson } from '../Utils';
import { PremiumModel } from '../shared/schema/PremiumSchema';

export const paymentRouter = Router();


export const ZBodyCreatePayment = z.object({
    user_id: z.string(),
    plan_id: z.number()
})

paymentRouter.post('/create', json(), async (req, res) => {
    try {
        const createPaymentData = ZBodyCreatePayment.parse(req.body);

        const plan = getPlanFromId(createPaymentData.plan_id);
        if (!plan) return sendJson(res, 400, { error: 'plan not found' });

        const premiumData = await PremiumModel.findById(createPaymentData.user_id);
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