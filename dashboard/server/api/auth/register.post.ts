import crypto from 'node:crypto';
import { z } from "zod";
import { RegisterModel } from '~/shared/schema/RegisterSchema';
import { UserModel } from '~/shared/schema/UserSchema';

const ZRegisterBody = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(64)
});

export default defineEventHandler(async (event) => {

    //TODO: SELFHOST
    
    const { email, password } = await readValidatedBody(event, ZRegisterBody.parse);

    const user = await UserModel.exists({ email });
    if (user) throw createError({ statusCode: 400, message: 'Email already registered' });

    const hashedPassword = await hashPassword(password);

    const code = crypto.randomBytes(3).toString('hex').toUpperCase();

    await RegisterModel.updateOne({ email }, { password: hashedPassword, code }, { upsert: true });

    const { BASE_URL } = useRuntimeConfig();

    const link = `${BASE_URL}/api/auth/confirm_email?code=${code}`;

    setImmediate(() => {
        const tRpc = useTRPC();
        tRpc.emails.email.sendConfirmEmail.mutate({ email, link });
    });

    return { ok: true };
});
