import { UserSettingsModel } from "@schema/UserSettings";
import { AuthContext } from "~/server/middleware/01-authorization";

export default defineEventHandler(async event => {
    const userData: AuthContext = getRequestUser(event) as any;
    if (!userData.logged) return;
    return 20;
});