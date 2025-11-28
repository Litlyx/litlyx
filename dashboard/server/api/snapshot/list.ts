
import { ProjectSnapshotModel, TProjectSnapshot } from "@schema/project/ProjectSnapshot";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'permission:member');

    const { project_id } = ctx;

    const snapshots = await ProjectSnapshotModel.find({ project_id });

    return snapshots.map(e => e.toJSON()) as TProjectSnapshot[];

});