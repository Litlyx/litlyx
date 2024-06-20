import { ProjectModel, TProject } from "@schema/ProjectSchema";
import { TeamMemberModel } from "@schema/TeamMemberSchema";

export async function hasAccessToProject(user_id: string, project_id: string, project?: TProject) {
    const targetProject = project || await ProjectModel.findById(project_id, { owner: true });
    if (!targetProject) return [false, 'NONE'];
    if (targetProject.owner.toString() === user_id) return [true, 'OWNER'];
    const members = await TeamMemberModel.find({ project_id });
    if (members.map(e => e.user_id.toString()).includes(user_id)) return [true, 'GUEST'];
    return [false, 'NONE'];
}