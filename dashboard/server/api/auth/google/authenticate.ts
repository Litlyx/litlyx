import { UserModel } from "~/shared/schema/UserSchema"



export default defineOAuthGoogleEventHandler({

    async onSuccess(event, result) {

        const user = await UserModel.findOne({
            email: result.user.email
        });

        if (!user) {

            const newUser = await UserModel.create({
                email: result.user.email,
                name: result.user.name ?? 'NO_NAME',
                given_name: result.user.given_name ?? 'NO_NAME',
                locale: result.user.locale ?? '',
                picture: ''
            })

            await replaceUserSession(event, {
                user: {
                    email: newUser.email,
                    name: newUser.name
                },
                secure: {
                    user_id: newUser.id
                },
                v: '0.0.1'
            });

            const tRpc = useTRPC();

            const customer = await tRpc.payments.customer.create.mutate({ email: newUser.email });
            await tRpc.payments.subscription.activate.mutate({
                user_id: newUser._id.toString(),
                customer_id: customer.customer_id,
                plan_tag: 'FREE_TRIAL_LITLYX_PRO'
            });

            setImmediate(() => {
                tRpc.emails.email.send_trial_1_started.mutate({ email: newUser.email });
            });

            return sendRedirect(event, '/')
        }

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

        return sendRedirect(event, '/')

    }

});