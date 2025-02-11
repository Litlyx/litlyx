
import crypto from 'crypto';
import { PasswordModel } from '@schema/PasswordSchema';
import { EmailService } from '@services/EmailService'
import { EmailServiceHelper } from '~/server/services/EmailServiceHelper';

export default defineEventHandler(async event => {

    const { email } = await readBody(event);

    const target = await PasswordModel.findOne({ email });
    if (!target) return { error: true, message: 'Internal error. User not found.' }


    const newPass = crypto.randomBytes(5).toString('hex');

    const hash = crypto.createHash('sha256');
    const hashedPassword = hash.update(newPass + '_litlyx').digest('hex');

    target.password = hashedPassword;
    await target.save();

    const emailData = EmailService.getEmailServerInfo('reset_password', { target: email, newPassword: newPass });
    EmailServiceHelper.sendEmail(emailData);

    return { error: false, message: 'Password changed' }

});