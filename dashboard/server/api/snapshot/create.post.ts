import { ProjectModel } from "@schema/ProjectSchema";
import { ProjectSnapshotModel } from "@schema/ProjectSnapshot";
import { UserSettingsModel } from "@schema/UserSettings";


export default defineEventHandler(async event => {

    const body = await readBody(event);

    const { name: newSnapshotName, from, to, color: snapshotColor } = body;

    if (!newSnapshotName) return setResponseStatus(event, 400, 'SnapshotName too short');
    if (newSnapshotName.length == 0) return setResponseStatus(event, 400, 'SnapshotName too short');

    if (!from) return setResponseStatus(event, 400, 'from is required');
    if (!to) return setResponseStatus(event, 400, 'to is required');
    if (!snapshotColor) return setResponseStatus(event, 400, 'color is required');

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const userSettings = await UserSettingsModel.findOne({ user_id: userData.id }, { active_project_id: 1 });

    if (!userSettings) return setResponseStatus(event, 500, 'Unkwnown error');

    const currentProjectId = userSettings.active_project_id;

    const project = await ProjectModel.findById(currentProjectId);
    if (!project) return setResponseStatus(event, 400, 'Project not found');


    const newSnapshot = await ProjectSnapshotModel.create({
        name: newSnapshotName,
        from: new Date(from),
        to: new Date(to),
        color: snapshotColor,
        project_id: currentProjectId
    });

    return newSnapshot.id;


});