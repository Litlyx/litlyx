
import { ProjectSnapshotModel } from "@schema/project/ProjectSnapshot";
import { z } from "zod";


const ZCreateSnapshotBody = z.object({
    name: z.string().trim().min(2).max(22),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
        message: "Color must be a hex code starting with # followed by 6 hex digits"
    }),
    from: z.string(),
    to: z.string()
})

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'permission:member');
    const { project_id } = ctx;

    const body = await readValidatedBody(event, ZCreateSnapshotBody.parse);

    const { name: newSnapshotName, from, to, color: snapshotColor } = body;

    const newSnapshot = await ProjectSnapshotModel.create({
        name: newSnapshotName,
        from: new Date(from),
        to: new Date(to),
        color: snapshotColor,
        project_id
    });

    return newSnapshot.id;


});