
import { createUserJwt } from '~/server/AuthManager';
import { UserModel } from '@schema/UserSchema';
import crypto from 'crypto';
import { PasswordModel } from '@schema/PasswordSchema';

export default defineEventHandler(async event => {

    const { email, password } = await readBody(event);

    const user = await UserModel.findOne({ email });

    if (!user) return { error: true, message: 'Email or Password wrong' }

    const hash = crypto.createHash('sha256');
    const hashedPassword = hash.update(password + '_litlyx').digest('hex');

    const target = await PasswordModel.findOne({ email, password: hashedPassword });

    if (!target) return { error: true, message: 'Email or Password wrong' }

    return { error: false, access_token: createUserJwt({ email: target.email, name: user.name }) }

});