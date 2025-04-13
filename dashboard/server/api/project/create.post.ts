import { ProjectModel, TProject } from "@schema/project/ProjectSchema";
import { ProjectCountModel } from "@schema/project/ProjectsCounts";

export default defineEventHandler(async event => {

    const body = await readBody(event);

    const newProjectName = body.name.trim();

    if (!newProjectName) return setResponseStatus(event, 400, 'ProjectName too short');
    if (newProjectName.length < 2) return setResponseStatus(event, 400, 'ProjectName too short');

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const maxProjects = 20;

    const existingUserProjects = await ProjectModel.countDocuments({ owner: userData.id });
    if (existingUserProjects >= maxProjects) return setResponseStatus(event, 400, 'Already have max number of projects');

    const project = await ProjectModel.create({ owner: userData.id, name: newProjectName });

    await ProjectCountModel.create({ project_id: project._id, events: 0, visits: 0, sessions: 0 });

    return project.toJSON() as TProject;



});