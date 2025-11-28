import { z } from "zod";
import { PasswordModel } from '~/shared/schema/PasswordSchema';
import { UserModel } from '~/shared/schema/UserSchema';

const ZLoginBody = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(64)
});

export default defineEventHandler(async (event) => {

    //TODO: SELFHOST

    const { email, password } = await readValidatedBody(event, ZLoginBody.parse)

    const user = await UserModel.findOne({ email });
    if (!user) throw createError({ status: 400, message: 'Email or Password wrong' });

    const passwordData = await PasswordModel.findOne({ email });
    if (!passwordData) throw createError({ status: 400, message: 'Email or Password wrong' });
    const passwordOk = await verifyPassword(passwordData.password, password);
    if (!passwordOk) throw createError({ status: 400, message: 'Email or Password wrong' });

    await replaceUserSession(event, {
        user: {
            email: user.email,
            name: user.name
        },
        secure: {
            user_id: user.id
        },
        v: '0.0.1'
    }, { maxAge: 60 * 60 * 24 * 7 });

});
