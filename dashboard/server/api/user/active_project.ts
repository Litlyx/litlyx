import { AuthContext, AuthContextLogged } from "~/server/middleware/01-authorization";
import { ProjectModel } from "@schema/ProjectSchema";
import { UserSettingsModel } from "@schema/UserSettings";

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;

    const userSettings = await UserSettingsModel.findOne({ user_id: userData.id }, {
        active_project_id: 1
    });

    if (!userSettings) {
        const projectOwned = await ProjectModel.findOne({ owner: userData.id }, { _id: 1 });
        return projectOwned?._id.toString();
    }
    return userSettings?.active_project_id.toString();
});