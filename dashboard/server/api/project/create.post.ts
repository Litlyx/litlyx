import { ProjectModel, TProject } from "@schema/project/ProjectSchema";
import { ProjectCountModel } from "@schema/project/ProjectsCounts";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event);

    const { name } = await readBody(event);

    const newProjectName = name.trim();

    if (!newProjectName) throw createError({ status: 400, message: 'name is required' });
    if (newProjectName.length <= 2) throw createError({ status: 400, message: 'Workspace name too short' });
    if (newProjectName.length >= 24) throw createError({ status: 400, message: 'Workspace name too long' });


    const plan = await getPlanInfoFromUserId(ctx.user_id);
    if (!plan) return setResponseStatus(event, 400, 'Plan not found. Please contact support');

    const maxProjects = plan.features.workspaces;

    const existingUserProjects = await ProjectModel.countDocuments({ owner: ctx.user_id });
    if (existingUserProjects >= maxProjects) throw createError({ status: 400, message: 'Workspace limit reached.', statusMessage: 'WORKSPACE_LIMIT_REACHED' });

    const project = await ProjectModel.create({ owner: ctx.user_id, name: newProjectName });

    await ProjectCountModel.create({ project_id: project._id, events: 0, visits: 0, sessions: 0 });

    return project.toJSON() as TProject;

});