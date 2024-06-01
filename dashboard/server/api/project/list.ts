import { ProjectModel, TProject } from "@schema/ProjectSchema";

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return [];


    const userProjects = await ProjectModel.find({ owner: userData.id });
    return userProjects.map(e => e.toJSON()) as TProject[];

});