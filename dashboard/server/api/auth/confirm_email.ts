
import { createUserJwt, readRegisterJwt } from '~/server/AuthManager';
import { UserModel } from '@schema/UserSchema';
import { PasswordModel } from '@schema/PasswordSchema';
import { EmailService } from '@services/EmailService';
import { EmailServiceHelper } from '~/server/services/EmailServiceHelper';

export default defineEventHandler(async event => {

    const { register_code } = getQuery(event);

    const data = readRegisterJwt(register_code as string);
    if (!data) return setResponseStatus(event, 400, 'Error decoding register_code');

    try {
        await PasswordModel.create({ email: data.email, password: data.password })
        await UserModel.create({ email: data.email, given_name: '', name: 'EmailLogin', locale: '', picture: '', created_at: Date.now() });
        setImmediate(() => {
            const emailData = EmailService.getEmailServerInfo('welcome', { target: data.email });
            EmailServiceHelper.sendEmail(emailData);
        });
        const jwt = createUserJwt({ email: data.email, name: 'EmailLogin' });
        return sendRedirect(event, `https://dashboard.litlyx.com/jwt_login?jwt_login=${jwt}`);
    } catch (ex) {
        return setResponseStatus(event, 400, 'Error creating user');
    }

});