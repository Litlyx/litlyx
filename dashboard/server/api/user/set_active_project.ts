
import { ProjectModel } from "@schema/ProjectSchema";

import { UserSettingsModel } from "@schema/UserSettings";

export default defineEventHandler(async event => {

    if (!event.context) return;

    const userData = getRequestUser(event);
    if (!userData?.logged) return;

    const { project_id } = getQuery(event);

    const hasAccess = await ProjectModel.exists({ owner: userData.id, _id: project_id });

    if (!hasAccess) return setResponseStatus(event, 400, 'No access to project');

    await UserSettingsModel.updateOne({ user_id: userData.id }, { active_project_id: project_id }, { upsert: true });

    return;

});