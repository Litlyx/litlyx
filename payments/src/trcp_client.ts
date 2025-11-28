import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../emails/src/index';

export const email_client = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: process.env.EMAIL_TRPC_URL as string,
            async headers() {
                return {
                    Authorization: `Bearer ${process.env.EMAIL_SECRET as string}`
                };
            },
        }),
    ],
});