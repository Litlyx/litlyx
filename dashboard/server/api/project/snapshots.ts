
import { ProjectSnapshotModel, TProjectSnapshot } from "@schema/ProjectSnapshot";
import { UserSettingsModel } from "@schema/UserSettings";

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const currentActiveProject = await UserSettingsModel.findOne({ user_id: userData.id });
    if (!currentActiveProject) return setResponseStatus(event, 400, 'You need to select a project');

    const project_id = currentActiveProject.active_project_id;

    const snapshots = await ProjectSnapshotModel.find({ project_id });

    return snapshots.map(e => e.toJSON()) as TProjectSnapshot[];

});