import { ProjectModel, TProject } from "@schema/project/ProjectSchema";
import { TTeamMember, TeamMemberModel } from "@schema/TeamMemberSchema";

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return [];


    const members = await TeamMemberModel.find({
        $or: [
            { user_id: userData.id },
            { email: userData.user.email }
        ],
        pending: false
    });

    const projects: TProject[] = [];

    for (const member of members) {
        const project = await ProjectModel.findById(member.project_id);
        if (!project) continue;
        projects.push(project.toJSON());
    }

    return projects;


});