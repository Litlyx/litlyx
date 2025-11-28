import { PasswordModel } from "~/shared/schema/PasswordSchema";
import { PremiumModel } from "~/shared/schema/PremiumSchema";
import { UserLimitModel } from "~/shared/schema/UserLimitSchema";
import { UserModel } from "~/shared/schema/UserSchema";

export default defineNitroPlugin(async () => {

    const selfhosted = isSelfhosted();
    const aiEnabled = isAiEnabled();

    console.log({ selfhosted, aiEnabled });

    if (!selfhosted) return;

    console.log('[SELFHOSTED] Admin account Creation');

    const { ADMIN_EMAIL, ADMIN_PASSWORD, LICENSE_KEY } = useRuntimeConfig();

    const admin_email = ADMIN_EMAIL;
    const admin_password = ADMIN_PASSWORD;

    if (!admin_email) throw createError({ status: 400, message: 'ADMIN_EMAIL is not defined in env' });
    if (!admin_password) throw createError({ status: 400, message: 'ADMIN_PASSWORD is not defined in env' });

    const hashedPassword = await hashPassword(admin_password);

    await UserModel.updateOne({ email: admin_email }, { email: admin_email, name: admin_email, given_name: admin_email, locale: '', picture: '' }, { upsert: true });
    await PasswordModel.updateOne({ email: admin_email }, { email: admin_email, password: hashedPassword }, { upsert: true });

    const user = await UserModel.findOne({ email: admin_email }, { _id: 1 });
    if (!user) throw Error('USER NOT FOUND');


    const licenseOk: any = await $fetch<any>(`https://license.litlyx.com/license/${LICENSE_KEY}`);

    await PremiumModel.updateOne({ user_id: user._id }, {
        premium_type: licenseOk.ok ? 9999 : 9998,
        customer_id: 'selfhosted',
        subscription_id: 'selfhosted',
        expire_at: Date.now() + 1000 * 60 * 60 * 24 * 365 * 100,
        plan_cancelled: false,
        payment_failed: false
    }, { upsert: true });

    await UserLimitModel.updateOne({ user_id: user._id }, {
        events: 0,
        visits: 0,
        ai_messages: 0,
        ai_limit: 999_999_999,
        limit: 999_999_999,
        billing_start_at: Date.now(),
        billing_expire_at: Date.now() + 1000 * 60 * 60 * 24 * 365 * 100
    }, { upsert: true });

    console.log('[SELFHOSTED] Admin account OK');

});