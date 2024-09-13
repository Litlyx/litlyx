
import { createUserJwt } from '~/server/AuthManager';
import { UserModel } from '@schema/UserSchema';
import EmailService from '@services/EmailService';

const config = useRuntimeConfig();

export default defineEventHandler(async event => {

    const { code } = getQuery(event);
    console.log('CODE', code);

    const redirect_uri = 'http://127.0.0.1:3000'

    const res = await fetch(`https://github.com/login/oauth/access_token?client_id=${config.GITHUB_AUTH_CLIENT_ID}&client_secret=${config.GITHUB_AUTH_CLIENT_SECRET}&code=${code}&redirect_url=${redirect_uri}`, {
        headers: {
            "Accept": "application/json",
            "Accept-Encoding": "application/json",
        },
    });

    const data = await res.json();

    const access_token = data.access_token;

    console.log(data);

    return sendRedirect(event,`http://127.0.0.1:3000/login?github_access_token=${access_token}`)


    // const origin = event.headers.get('origin');

    // const tokenResponse = await client.getToken({
    //     code: body.code,
    //     redirect_uri: origin || ''
    // });

    // const tokens = tokenResponse.tokens;

    // const ticket = await client.verifyIdToken({
    //     idToken: tokens.id_token || '',
    //     audience: GOOGLE_AUTH_CLIENT_ID,
    // });

    // const payload = ticket.getPayload();
    // if (!payload) return { error: true, access_token: '' };


    // const user = await UserModel.findOne({ email: payload.email });

    // if (user) return { error: false, access_token: createUserJwt({ email: user.email, name: user.name }) }


    // const newUser = new UserModel({
    //     email: payload.email,
    //     given_name: payload.given_name,
    //     name: payload.name,
    //     locale: payload.locale,
    //     picture: payload.picture,
    //     created_at: Date.now()
    // });

    // const savedUser = await newUser.save();

    // setImmediate(() => {
    //     console.log('SENDING WELCOME EMAIL TO', payload.email);
    //     if (payload.email) EmailService.sendWelcomeEmail(payload.email);
    // });

    // return { error: false, access_token: createUserJwt({ email: savedUser.email, name: savedUser.name }) }

});