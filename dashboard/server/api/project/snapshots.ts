
import { ProjectSnapshotModel, TProjectSnapshot } from "@schema/ProjectSnapshot";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, { requireSchema: false, allowLitlyx: false });
    if (!data) return;

    const { project_id } = data;

    const snapshots = await ProjectSnapshotModel.find({ project_id });

    return snapshots.map(e => e.toJSON()) as TProjectSnapshot[];

});