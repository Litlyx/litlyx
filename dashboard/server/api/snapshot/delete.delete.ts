import { ProjectModel } from "@schema/project/ProjectSchema";
import { ProjectSnapshotModel } from "@schema/project/ProjectSnapshot";


export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'permission:member');

    const { project_id } = ctx;

    const body = await readBody(event);
    const { id: snapshotId } = body;

    if (!snapshotId) return setResponseStatus(event, 400, 'id is required');

    const deletation = await ProjectSnapshotModel.deleteOne({
        project_id: project_id,
        _id: snapshotId
    });

    return { ok: deletation.acknowledged };


});