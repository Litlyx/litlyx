import z from 'zod';
import { PasswordModel } from '~/shared/schema/PasswordSchema';
import crypto from 'crypto';

const ZResetPasswordBody = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(64),
    jwt: z.string()
})

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'flag:allowAnon');

    const { email, password, jwt } = await readValidatedBody(event, ZResetPasswordBody.parse);

    const { RESET_PASSWORD_SECRET } = useRuntimeConfig();
    const readHash = crypto.createHash('sha256');
    const hashedSecret = readHash.update(`${RESET_PASSWORD_SECRET}:${email}`).digest('hex');

    const ok = hashedSecret === jwt;

    if (!ok) throw createError({ status: 400, message: 'Error during password set. Please contact support.' });

    const userNewPassword = await hashPassword(password)

    await PasswordModel.updateOne({ email }, { password: userNewPassword });

    return { ok: true }

});