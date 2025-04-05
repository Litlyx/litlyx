
import { raw, Router } from 'express';
import { sendJson } from '../Utils';
import StripeService from '../services/StripeService';

import * as WebhookController from '../controllers/WebhookController'

export const webhookRouter = Router();


webhookRouter.post('/', raw({ type: 'application/json' }), async (req, res) => {
    try {

        const signature = req.header('stripe-signature');
        if (!signature) return sendJson(res, 400, { error: 'No signature' });

        const eventData = StripeService.parseWebhook(req.body, signature);
        if (!eventData) return sendJson(res, 400, { error: 'Error parsing event data' });

        if (eventData.type === 'invoice.paid') {
            const response = await WebhookController.onPaymentSuccess(eventData);
            return sendJson(res, 200, response);
        }

        if (eventData.type === 'invoice.payment_failed') {
            const response = await WebhookController.onPaymentFailed(eventData);
            return sendJson(res, 200, response);
        }


    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});