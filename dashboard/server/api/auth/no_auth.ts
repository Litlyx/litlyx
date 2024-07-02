
import { createUserJwt } from '~/server/AuthManager';
import { UserModel } from '@schema/UserSchema';

const { NOAUTH_USER_EMAIL, NOAUTH_USER_NAME, GOOGLE_AUTH_CLIENT_ID } = useRuntimeConfig();

const noAuthMode = GOOGLE_AUTH_CLIENT_ID.length == 0;

export default defineEventHandler(async event => {

    if (!noAuthMode) {
        console.error('Endpoint available only in NO_AUTH mode');
        return { error: true, access_token: '' }
    }

    if (!NOAUTH_USER_EMAIL) {
        console.error('NOAUTH_USER_EMAIL is required in NO_AUTH mode');
        return { error: true, access_token: '' }
    }

    if (!NOAUTH_USER_NAME) {
        console.error('NOAUTH_USER_NAME is required in NO_AUTH mode');
        return { error: true, access_token: '' }
    }

    const user = await UserModel.findOne({ email: NOAUTH_USER_EMAIL });

    if (user) return {
        error: false,
        access_token: createUserJwt({
            email: user.email,
            name: user.name
        })
    }

    const newUser = new UserModel({
        email: NOAUTH_USER_EMAIL,
        given_name: NOAUTH_USER_NAME,
        name: NOAUTH_USER_NAME,
        locale: 'no-auth',
        picture: '',
        created_at: Date.now()
    });

    const savedUser = await newUser.save();

    return { error: false, access_token: createUserJwt({ email: savedUser.email, name: savedUser.name }) }

});