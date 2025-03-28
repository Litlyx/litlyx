import express from 'express';
import StripeService from './services/StripeService'
import { webhookRouter } from './routers/WebhookRouter';
import { paymentRouter } from './routers/PaymentRouter';


const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_TESTMODE = process.env.STRIPE_TESTMODE === 'true';

StripeService.init(STRIPE_PRIVATE_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_TESTMODE);

console.log('Stripe started in', STRIPE_TESTMODE ? 'TESTMODE' : 'LIVEMODE');

const app = express();

app.use('/webhook', webhookRouter);
app.use('/payment', paymentRouter);

const port = parseInt(process.env.PORT);
if (!port) {
    console.error('PORT is not set');
    process.exit();
}

app.listen(port, () => console.log(`Listening on port ${port}`));