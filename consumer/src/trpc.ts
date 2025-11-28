import { createTRPCClient, httpBatchLink, TRPCClient } from '@trpc/client';

//@ts-ignore
import type { AppRouter as EmailsAppRouter } from '../../emails/src/index'

class TRPC {

    public client: TRPCClient<EmailsAppRouter>

    init(url: string, secret: string) {
        this.client = createTRPCClient<EmailsAppRouter>({
            links: [
                httpBatchLink({
                    url,
                    headers: {
                        Authorization: `Bearer ${secret}`
                    }
                }),
            ],
        });
    }

}

export const TrcpInstance = new TRPC();

