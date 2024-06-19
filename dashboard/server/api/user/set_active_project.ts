
import { ProjectModel } from "@schema/ProjectSchema";

import { UserSettingsModel } from "@schema/UserSettings";
import { hasAccessToProject } from "~/server/utils/hasAccessToProject";

export default defineEventHandler(async event => {

    if (!event.context) return;

    const userData = getRequestUser(event);
    if (!userData?.logged) return;

    const { project_id } = getQuery(event);

    const hasAccess = await hasAccessToProject(userData.id, project_id as string);

    if (!hasAccess) return setResponseStatus(event, 400, 'No access to project');

    await UserSettingsModel.updateOne({ user_id: userData.id }, { active_project_id: project_id }, { upsert: true });

    return;

});