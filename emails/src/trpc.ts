import { initTRPC, TRPCError } from '@trpc/server';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';

const t = initTRPC.context<Context>().create()

export const router = t.router;
const publicProcedure = t.procedure;

export type Context = ReturnType<typeof createContext>;

export function createContext({ req }: CreateHTTPContextOptions) {
    return { headers: req.headers }
}

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
    try {
        const headers = ctx.headers;
        const authorization = headers.authorization;
        if (!authorization) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing Authorization header' });
        const [mode, content] = authorization.split(' ');
        if (mode !== 'Bearer') throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authorization type not valid' });
        if (content !== process.env.EMAIL_SECRET) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authorization token invalid', });
        return next();
    } catch (ex) {
        console.error(ex);
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Error during authorization' });
    }
});