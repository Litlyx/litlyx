import { json, Router } from 'express';
import z from 'zod';
import { getPlanFromId } from '../shared/data/PLANS';
import StripeService from '../services/StripeService';
import { sendJson } from '../Utils';
import { ProjectModel } from '../shared/schema/project/ProjectSchema';

export const paymentRouter = Router();


export const ZBodyCreatePayment = z.object({
    pid: z.string(),
    plan_id: z.number()
})

paymentRouter.post('/create', json(), async (req, res) => {
    try {
        const createPaymentData = ZBodyCreatePayment.parse(req.body);

        const plan = getPlanFromId(createPaymentData.plan_id);
        if (!plan) return sendJson(res, 400, { error: 'plan not found' });

        const project = await ProjectModel.findById(createPaymentData.pid);
        if (!project) return sendJson(res, 400, { error: 'project not found' });
        if (!project.customer_id) return sendJson(res, 400, { error: 'project have no customer_id' });

        const price = StripeService.testMode ? plan.PRICE_TEST : plan.PRICE;

        const checkout = await StripeService.createPayment(
            price,
            'https://dashboard.litlyx.com/payment_ok',
            createPaymentData.pid,
            project.customer_id
        );

        if (!checkout) return sendJson(res, 400, { error: 'cannot create payment' });

        return sendJson(res, 200, { url: checkout.url });

    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});