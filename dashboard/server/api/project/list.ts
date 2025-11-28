import { ProjectModel, TProject } from "@schema/project/ProjectSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event);
    const { user_id } = ctx;
    
    const projects = await ProjectModel.find({ owner: user_id });
    return projects.map(e => e.toJSON()) as TProject[];

});