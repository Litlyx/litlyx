
import { json, Router } from 'express';

export const webhookRouter = Router();


webhookRouter.get('/', json(), async (req, res) => {
    try {

        const signature = req.header('stripe-signature');
        if (!signature) {
            console.error('No signature on the webhook')
        }


    } catch (ex) {
        res.status(500).json({ error: ex.message });
    }
});