import express from 'express';
import StripeService from './services/StripeService'
import { webhookRouter } from './routers/WebhookRouter';
import { paymentRouter } from './routers/PaymentRouter';
import { connectDatabase } from './shared/services/DatabaseService';


const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_TESTMODE = process.env.STRIPE_TESTMODE === 'true';
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

StripeService.init(STRIPE_PRIVATE_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_TESTMODE);
connectDatabase(MONGO_CONNECTION_STRING);

console.log('Stripe started in', STRIPE_TESTMODE ? 'TESTMODE' : 'LIVEMODE');

const app = express();

const TOKEN = process.env.TOKEN;

if (!TOKEN || TOKEN.length == 0) {
    console.log('TOKEN not set');
    process.exit();
}

app.use('/webhook', webhookRouter);

app.use((req, res, next) => {
    const token = req.header('x-litlyx-token');
    if (token != TOKEN) {
        res.status(403).json({ error: 'token not valid' });
        return;
    }
    console.log(req.path);
    next();
});

app.use('/payment', paymentRouter);

const port = parseInt(process.env.PORT);
if (!port) {
    console.error('PORT is not set');
    process.exit();
}

app.listen(port, () => console.log(`Listening on port ${port}`));