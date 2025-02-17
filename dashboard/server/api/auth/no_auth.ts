
import { createUserJwt } from '~/server/AuthManager';
import { UserModel } from '@schema/UserSchema';

const { NOAUTH_USER_EMAIL, NOAUTH_USER_PASS, public: publicRuntime } = useRuntimeConfig();

const noAuthMode = publicRuntime.AUTH_MODE == 'NO_AUTH';

export default defineEventHandler(async event => {

    if (!noAuthMode) {
        console.error('Endpoint available only in NO_AUTH mode');
        return { error: true, access_token: '' }
    }

    if (!NOAUTH_USER_EMAIL) {
        console.error('NOAUTH_USER_EMAIL is required in NO_AUTH mode');
        return { error: true, access_token: '' }
    }

    if (!NOAUTH_USER_PASS) {
        console.error('NOAUTH_USER_PASS is required in NO_AUTH mode');
        return { error: true, access_token: '' }
    }

    const body = await readBody(event);

    if (body.email != NOAUTH_USER_EMAIL || body.password != NOAUTH_USER_PASS) return { error: true, access_token: '', errorMessage: 'Username or password invalid' }

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
        given_name: NOAUTH_USER_EMAIL.split('@')[0] || 'NONAME',
        name: NOAUTH_USER_EMAIL.split('@')[0] || 'NONAME',
        locale: 'no-auth',
        picture: '',
        created_at: Date.now()
    });

    const savedUser = await newUser.save();

    return { error: false, access_token: createUserJwt({ email: savedUser.email, name: savedUser.name }) }

});