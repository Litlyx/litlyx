import { PasswordModel } from "~/shared/schema/PasswordSchema";

export type TUserMe = {
    email: string,
    name: string,
    email_login: boolean
}

export default defineEventHandler(async event => {
    const { user, v, secure } = await requireUserSession(event);

    const hasPassword = await PasswordModel.exists({ email: user.email });

    const result: TUserMe = {
        email: user.email,
        name: user.name,
        email_login: hasPassword != null
    }
    return result;
});

