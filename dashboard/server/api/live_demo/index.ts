import { ProjectModel, TProject } from "@schema/ProjectSchema";

export default defineEventHandler(async event => {
    const liveDemoProject = await ProjectModel.findById('6643cd08a1854e3b81722ab5');
    if (!liveDemoProject) return;
    return liveDemoProject.toJSON() as TProject;
});