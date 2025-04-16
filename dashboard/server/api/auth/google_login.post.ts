
import { OAuth2Client } from 'google-auth-library';
import { createUserJwt } from '~/server/AuthManager';
import { UserModel } from '@schema/UserSchema';
import { EmailService } from '@services/EmailService';
import { EmailServiceHelper } from '~/server/services/EmailServiceHelper';
import { PaymentServiceHelper } from '~/server/services/PaymentServiceHelper';

const { GOOGLE_AUTH_CLIENT_SECRET, GOOGLE_AUTH_CLIENT_ID } = useRuntimeConfig()

const client = new OAuth2Client({
    clientId: GOOGLE_AUTH_CLIENT_ID,
    clientSecret: GOOGLE_AUTH_CLIENT_SECRET
});



export default defineEventHandler(async event => {
    const body = await readBody(event)

    const origin = event.headers.get('origin');

    const tokenResponse = await client.getToken({
        code: body.code,
        redirect_uri: origin || ''
    });

    const tokens = tokenResponse.tokens;

    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token || '',
        audience: GOOGLE_AUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return { error: true, access_token: '' };


    const user = await UserModel.findOne({ email: payload.email });

    if (user) {
        await user.save();
        return {
            error: false,
            access_token: createUserJwt({ email: user.email, name: user.name })
        }
    }

    const newUser = new UserModel({
        email: payload.email,
        given_name: payload.given_name,
        name: payload.name,
        locale: payload.locale,
        picture: payload.picture,
        created_at: Date.now()
    });

    const savedUser = await newUser.save();

    const [ok, error] = await PaymentServiceHelper.create_customer(savedUser.id);
    if (!ok) throw error;

    setImmediate(() => {
        if (!payload.email) return;
        const emailData = EmailService.getEmailServerInfo('brevolist_add', { email: payload.email });
        EmailServiceHelper.sendEmail(emailData);
    });


    setImmediate(() => {
        if (!payload.email) return;
        const emailData = EmailService.getEmailServerInfo('welcome', { target: payload.email });
        EmailServiceHelper.sendEmail(emailData);
    });

    return { error: false, access_token: createUserJwt({ email: savedUser.email, name: savedUser.name }) }

});