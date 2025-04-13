
import { createUserJwt, readRegisterJwt } from '~/server/AuthManager';
import { UserModel } from '@schema/UserSchema';
import { PasswordModel } from '@schema/PasswordSchema';
import { EmailService } from '@services/EmailService';
import { EmailServiceHelper } from '~/server/services/EmailServiceHelper';
import { PaymentServiceHelper } from '~/server/services/PaymentServiceHelper';

export default defineEventHandler(async event => {

    const { register_code } = getQuery(event);

    const data = readRegisterJwt(register_code as string);
    if (!data) return setResponseStatus(event, 400, 'Error decoding register_code');

    try {
        await PasswordModel.updateOne({ email: data.email }, { password: data.password }, { upsert: true });

        const user = await UserModel.create({ email: data.email, given_name: '', name: 'EmailLogin', locale: '', picture: '', created_at: Date.now() });

        const [ok, error] = await PaymentServiceHelper.create_customer(user.id);
        if (!ok) throw error;

        setImmediate(() => {
            const emailData = EmailService.getEmailServerInfo('welcome', { target: data.email });
            EmailServiceHelper.sendEmail(emailData);
        });

        const jwt = createUserJwt({ email: data.email, name: 'EmailLogin' });
        return sendRedirect(event, `https://dashboard.litlyx.com/jwt_login?jwt_login=${jwt}`);
    } catch (ex) {
        console.error(ex);
        return setResponseStatus(event, 400, 'Error creating user');
    }

});