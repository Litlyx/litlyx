
import { createRegisterJwt } from '~/server/AuthManager';
import { UserModel } from '@schema/UserSchema';
import { RegisterModel } from '@schema/RegisterSchema';
import { EmailService } from '@services/EmailService';
import crypto from 'crypto';
import { EmailServiceHelper } from '~/server/services/EmailServiceHelper';

function canRegister(email: string, password: string) {
    if (email.length == 0) return false;
    if (!email.includes('@')) return false;
    if (!email.includes('.')) return false;
    if (password.length < 6) return false;
    return true;
};

export default defineEventHandler(async event => {

    const { email, password } = await readBody(event);

    if (!canRegister(email, password)) return setResponseStatus(event, 400, 'Email or Password not match criteria');

    const user = await UserModel.findOne({ email });

    if (user) return {
        error: true,
        message: 'Email already registered'
    }

    const hash = crypto.createHash('sha256');
    const hashedPassword = hash.update(password + '_litlyx').digest('hex');

    const jwt = createRegisterJwt(email, hashedPassword);

    await RegisterModel.create({ email, password: hashedPassword });

    setImmediate(() => {
        const emailData = EmailService.getEmailServerInfo('brevolist_add', { email });
        EmailServiceHelper.sendEmail(emailData);
    });

    setImmediate(() => {
        const emailData = EmailService.getEmailServerInfo('confirm', { target: email, link: `https://dashboard.litlyx.com/api/auth/confirm_email?register_code=${jwt}` });
        EmailServiceHelper.sendEmail(emailData);
    });

    return {
        error: false,
        message: 'OK'
    }

});