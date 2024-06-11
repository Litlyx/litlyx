import { UserSettingsModel } from "@schema/UserSettings";
import { AuthContext } from "~/server/middleware/01-authorization";

export default defineEventHandler(async event => {
    const userData: AuthContext = getRequestUser(event) as any;
    if (!userData.logged) return;
    const userSettings = await UserSettingsModel.findOne({ user_id: userData.id }, { max_projects: 1 });
    return userSettings?.max_projects || 3;
});