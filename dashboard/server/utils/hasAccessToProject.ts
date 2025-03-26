import { ProjectModel, TProject } from "@schema/project/ProjectSchema";
import { TeamMemberModel } from "@schema/TeamMemberSchema";

export async function hasAccessToProject(user_id: string, project_id: string, email: string, project?: TProject) {
    const targetProject = project ?? await ProjectModel.findById(project_id, { owner: true });
    if (!targetProject) return [false, 'NONE'];
    if (targetProject.owner.toString() === user_id) return [true, 'OWNER'];
    const isGuest = await TeamMemberModel.exists({ project_id, $or: [{ user_id }, { email }] });
    if (isGuest) return [true, 'GUEST'];
    return [false, 'NONE'];
}