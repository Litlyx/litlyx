import z from 'zod';
import { PasswordModel } from '~/shared/schema/PasswordSchema';
import { UserModel } from '~/shared/schema/UserSchema';
import crypto from 'crypto';

const ZResetPasswordBody = z.object({
    email: z.string().email()
})

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'flag:allowAnon');

    const { email } = await readValidatedBody(event, ZResetPasswordBody.parse);
    const user = await UserModel.findOne({ email });
    if (!user) return { ok: true };

    const pass = await PasswordModel.findOne({ email });
    if (!pass) throw createError({ status: 400, message: 'The account is associated to a Social Login. You cannot reset the password.' });

    const { BASE_URL, RESET_PASSWORD_SECRET } = useRuntimeConfig();

    const hash = crypto.createHash('sha256');
    const authenticationCode = hash.update(`${RESET_PASSWORD_SECRET}:${email}`).digest('hex');

    const link = `${BASE_URL}/reset_password?code=${authenticationCode}&mail=${Buffer.from(email).toString('base64')}`;

    const tRpc = useTRPC();
    await tRpc.emails.email.sendResetPasswordEmail.mutate({ email, link })

    return { ok: true }

});