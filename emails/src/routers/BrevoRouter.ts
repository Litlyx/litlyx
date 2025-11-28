import { protectedProcedure, router } from '../trpc';
import { EmailService } from '../services/EmailService';
import z from 'zod';

const ZAddToBrevoListInput = z.object({ email: z.string().email() });

export const brevoRouter = router({
    addToBrevoList: protectedProcedure.input(ZAddToBrevoListInput).mutation(async (opts) => {
        const result = await EmailService.createContact(opts.input.email);
        return { ok: result };
    }),
});