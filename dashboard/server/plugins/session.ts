import { UserModel } from "~/shared/schema/UserSchema";

export default defineNitroPlugin(() => {

    sessionHooks.hook('fetch', async (session, event) => {
        const user_id = session.secure?.user_id;
        if (!user_id) throw createError({ status: 401, message: 'Session expired' });
        const user = await UserModel.findById({ _id: user_id });
        if (!user) throw createError({ status: 401, message: 'Session expired' });
    });

    sessionHooks.hook('clear', async (session, event) => {

    });

});