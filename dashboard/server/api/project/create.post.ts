import { ProjectModel, TProject } from "@schema/ProjectSchema";

export default defineEventHandler(async event => {

    const body = await readBody(event);

    const newProjectName = body.name;

    if (!newProjectName) return setResponseStatus(event, 400, 'ProjectName too short');
    if (newProjectName.length < 2) return setResponseStatus(event, 400, 'ProjectName too short');

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const existingUserProjects = await ProjectModel.countDocuments({ owner: userData.id });
    if (existingUserProjects == 3) return setResponseStatus(event, 400, 'Already have 3 projects');

    const newProject = new ProjectModel({ owner: userData.id, name: newProjectName });
    const saved = await newProject.save();

    return saved.toJSON() as TProject;

});