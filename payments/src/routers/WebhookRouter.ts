
import { json, Router } from 'express';
import { sendJson } from '../Utils';
import StripeService from '../services/StripeService';

import * as WebhookController from '../controllers/WebhookController'

export const webhookRouter = Router();


webhookRouter.get('/', json(), async (req, res) => {
    try {

        const signature = req.header('stripe-signature');
        if (!signature) return sendJson(res, 400, { error: 'No signature' });

        const eventData = StripeService.parseWebhook(req.body, signature);
        if (!eventData) return sendJson(res, 400, { error: 'Error parsing event data' });

        if (eventData.type === 'invoice.paid') {
            const response = await WebhookController.onPaymentSuccess(eventData);
            return sendJson(res, 200, response);
        }
        
        // if (eventData.type === 'payment_intent.succeeded') return await onPaymentOnetimeSuccess(eventData);
        // if (eventData.type === 'invoice.payment_failed') return await onPaymentFailed(eventData);
        // if (eventData.type === 'customer.subscription.deleted') return await onSubscriptionDeleted(eventData);
        // if (eventData.type === 'customer.subscription.created') return await onSubscriptionCreated(eventData);
        // if (eventData.type === 'customer.subscription.updated') return await onSubscriptionUpdated(eventData);

    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});