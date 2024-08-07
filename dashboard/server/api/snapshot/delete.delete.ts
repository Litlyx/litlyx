import { ProjectModel } from "@schema/ProjectSchema";
import { ProjectSnapshotModel } from "@schema/ProjectSnapshot";
import { UserSettingsModel } from "@schema/UserSettings";


export default defineEventHandler(async event => {

    const body = await readBody(event);

    const { id: snapshotId } = body;

    if (!snapshotId) return setResponseStatus(event, 400, 'id is required');

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const userSettings = await UserSettingsModel.findOne({ user_id: userData.id }, { active_project_id: 1 });

    if (!userSettings) return setResponseStatus(event, 500, 'Unkwnown error');

    const currentProjectId = userSettings.active_project_id;

    const project = await ProjectModel.findById(currentProjectId);
    if (!project) return setResponseStatus(event, 400, 'Project not found');


    const deletation = await ProjectSnapshotModel.deleteOne({
        project_id: currentProjectId,
        _id: snapshotId
    });

    return { ok: deletation.acknowledged };


});