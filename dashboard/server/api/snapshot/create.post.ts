import { ProjectModel } from "@schema/project/ProjectSchema";
import { ProjectSnapshotModel } from "@schema/project/ProjectSnapshot";


export default defineEventHandler(async event => {

    const data = await getRequestData(event, { requireSchema: false, allowGuests: true, requireRange: false });
    if (!data) return;

    const body = await readBody(event);

    const { name: newSnapshotName, from, to, color: snapshotColor } = body;

    if (!newSnapshotName) return setResponseStatus(event, 400, 'SnapshotName too short');
    if (newSnapshotName.length == 0) return setResponseStatus(event, 400, 'SnapshotName too short');

    if (!from) return setResponseStatus(event, 400, 'from is required');
    if (!to) return setResponseStatus(event, 400, 'to is required');
    if (!snapshotColor) return setResponseStatus(event, 400, 'color is required');

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');


    const project = await ProjectModel.findById(data.project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');


    const newSnapshot = await ProjectSnapshotModel.create({
        name: newSnapshotName,
        from: new Date(from),
        to: new Date(to),
        color: snapshotColor,
        project_id: data.project_id
    });

    return newSnapshot.id;


});