
import { PasswordModel } from "@schema/PasswordSchema";

export default defineEventHandler(async event => {
    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    const hasPassword = await PasswordModel.exists({ email: userData.user.email });
    if (hasPassword) return { can_change: true };
    return { can_change: false }
});