import StripeService from './services/StripeService'
import { router, createContext } from './trpc';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

import * as trpcExpress from '@trpc/server/adapters/express';
import { connectDatabase } from './shared/services/DatabaseService';
import { customerRouter } from './routers/CustomerRouter';
import { invoiceRouter } from './routers/InvoiceRouter';
import { subscriptionRouter } from './routers/SubscriptionRouter';
import { webhookRouter } from './routers/WebhookRouter';
import { startTickService } from './services/TickService';

if (!process.env.STRIPE_PRIVATE_KEY) throw Error('STRIPE_PRIVATE_KEY is required');
if (!process.env.STRIPE_WEBHOOK_SECRET) throw Error('STRIPE_WEBHOOK_SECRET is required');
if (!process.env.MONGO_CONNECTION_STRING) throw Error('MONGO_CONNECTION_STRING is required');
if (!process.env.PORT) throw Error('PORT is required');
if (!process.env.EMAIL_TRPC_URL) throw Error('EMAIL_TRPC_URL is required');
if (!process.env.EMAIL_SECRET) throw Error('EMAIL_SECRET is required');

StripeService.init(process.env.STRIPE_PRIVATE_KEY, process.env.STRIPE_WEBHOOK_SECRET);
connectDatabase(process.env.MONGO_CONNECTION_STRING);

console.log('Stripe started in', StripeService.testMode ? 'TESTMODE' : 'LIVEMODE');

export type AppRouter = typeof appRouter;

const appRouter = router({
    customer: customerRouter,
    invoice: invoiceRouter,
    subscription: subscriptionRouter
});

app.use((req, res, next) => {
    console.log(new Date().toLocaleString('it-IT'), req.method, req.path);
    next();
});

app.use('/webhook', webhookRouter);

app.use('/trpc', trpcExpress.createExpressMiddleware({ router: appRouter, createContext }));


const port = parseInt(process.env.PORT);
if (!port) {
    console.error('PORT is not set');
    process.exit();
}
if (isNaN(port)) {
    console.error('PORT is not a valid number');
    process.exit();
}

// BillingDeamonService.start();

startTickService();

app.listen(port, () => console.log(`[PAYMENTS] Listening on port ${port}`));