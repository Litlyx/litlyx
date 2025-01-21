import { ProjectModel } from "@schema/project/ProjectSchema";
import { ProjectSnapshotModel } from "@schema/project/ProjectSnapshot";


export default defineEventHandler(async event => {

    const data = await getRequestDataOld(event, { requireSchema: false, allowGuests: false, requireRange: false });
    if (!data) return;

    const body = await readBody(event);

    const { id: snapshotId } = body;

    if (!snapshotId) return setResponseStatus(event, 400, 'id is required');

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const project = await ProjectModel.findById(data.project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');

    const deletation = await ProjectSnapshotModel.deleteOne({
        project_id: data.project_id,
        _id: snapshotId
    });

    return { ok: deletation.acknowledged };


});