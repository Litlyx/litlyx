
import { UserModel } from '@schema/UserSchema';
import { PasswordModel } from '@schema/PasswordSchema';
import { RegisterModel } from '~/shared/schema/RegisterSchema';

export default defineEventHandler(async event => {

    //TODO: SELFHOST
    
    const { code } = getQuery(event);

    const registerTarget = await RegisterModel.findOne({ code });
    if (!registerTarget) throw createError({ status: 400, message: 'Code not valid' });

    const userExist = await UserModel.exists({ email: registerTarget.email });
    if (userExist) throw createError({ status: 400, message: 'Email already registered' });

    await PasswordModel.updateOne({ email: registerTarget.email }, { password: registerTarget.password }, { upsert: true });

    const user = await UserModel.create({ email: registerTarget.email, given_name: '', name: 'EmailLogin', locale: '', picture: '', created_at: Date.now() });

    const tRpc = useTRPC();

    const customer = await tRpc.payments.customer.create.mutate({ email: user.email });
    await tRpc.payments.subscription.activate.mutate({ user_id: user._id.toString(), customer_id: customer.customer_id, plan_tag: 'FREE_TRIAL_LITLYX_PRO' });

    setImmediate(() => {
        tRpc.emails.brevo.addToBrevoList.mutate({ email: user.email });
    });
    
    setImmediate(() => {
        tRpc.emails.email.send_trial_1_started.mutate({ email: user.email });
    });

    await replaceUserSession(event, {
        user: {
            email: user.email,
            name: user.name
        },
        secure: {
            user_id: user.id
        },
        v: '0.0.1'
    });

    return sendRedirect(event, '/');


});