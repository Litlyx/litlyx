
import crypto from 'crypto';
import { PasswordModel } from '@schema/PasswordSchema';

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;

    const { old_password, new_password } = await readBody(event);

    if (new_password.length < 6) return { error: true, message: 'Password too short' }

    const target = await PasswordModel.findOne({ email: userData.user.email });
    if (!target) return { error: true, message: 'Internal error. User not found.' }

    const hashOld = crypto.createHash('sha256');
    const hashedPasswordOld = hashOld.update(old_password + '_litlyx').digest('hex');

    if (target.password !== hashedPasswordOld) {
        return { error: true, message: 'Old password not correct' }
    }

    const hashNew = crypto.createHash('sha256');
    const hashedPasswordNew = hashNew.update(new_password + '_litlyx').digest('hex');

    target.password = hashedPasswordNew;

    await target.save();

    return { error: false, message: 'Success' }

});