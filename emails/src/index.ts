import { router, createContext } from './trpc';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

import * as trpcExpress from '@trpc/server/adapters/express';
import { emailRouter } from './routers/EmailRouter'
import { brevoRouter } from './routers/BrevoRouter'
import { EmailService } from './services/EmailService'

if (!process.env.PORT) throw Error('PORT is required');

if (process.env.BREVO_KEY) {
    EmailService.init(process.env.BREVO_KEY);
} else {
    throw Error('BREVO_KEY is required');
}

export type AppRouter = typeof appRouter;

const appRouter = router({
    email: emailRouter,
    brevo: brevoRouter
});



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

app.listen(port, () => console.log(`[EMAILS] Listening on port ${port}`));
