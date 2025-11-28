
import type { AppRouter as PaymentsAppRouter } from '../../../payments/src/index';
import type { AppRouter as EmailAppRouter } from '../../../emails/src/index';
import { createTRPCClient, httpBatchLink, TRPCClient } from '@trpc/client';


export type tRpcPaymentsType = TRPCClient<PaymentsAppRouter>;
export type tRpcEmailsType = TRPCClient<EmailAppRouter>;


const config = useRuntimeConfig();

export default defineNitroPlugin(async nitroApp => {
    try {
        
        if (isSelfhosted()) return;

        const tRpcPayments = createTRPCClient<PaymentsAppRouter>({
            links: [
                httpBatchLink({
                    url: config.PAYMENT_TRPC_URL,
                    headers: {
                        Authorization: `Bearer ${config.PAYMENT_SECRET}`
                    }
                }),
            ],
        });

        const tRpcEmails = createTRPCClient<EmailAppRouter>({
            links: [
                httpBatchLink({
                    url: config.EMAIL_TRPC_URL,
                    headers: {
                        Authorization: `Bearer ${config.EMAIL_SECRET}`
                    }
                }),
            ],
        });


        const app = nitroApp as any;

        app.shared = app.shared || {};
        app.shared.tRpcPayments = tRpcPayments;
        app.shared.tRpcEmails = tRpcEmails;

        console.log('tRpc setup complete.')

    } catch (ex) {
        console.error(ex);
    }
})