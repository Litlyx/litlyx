import { ProjectModel } from "~/shared/schema/project/ProjectSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');

    const { project_id } = ctx;

    const body = await readBody(event);

    const name = body.name.trim();

    if (name.trim().length == 0) throw createError({ status: 400, message: 'Name is required' });
    if (name.trim().length <= 2) throw createError({ status: 400, message: 'Name too short' });
    if (name.trim().length >= 24) throw createError({ status: 400, message: 'Name too long' });

    await ProjectModel.updateOne({ _id: project_id }, { name });

    return { ok: true };

});