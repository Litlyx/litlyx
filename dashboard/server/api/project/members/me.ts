import { ProjectModel } from "@schema/project/ProjectSchema";
import { TeamMemberModel, TeamMemberRole, TPermission, TTeamMember } from "@schema/TeamMemberSchema";
import { UserModel } from "@schema/UserSchema";


export default defineEventHandler(async event => {

    const data = await getRequestData(event, []);
    if (!data) return;

    const { project_id, project, user } = data;

    const owner = await UserModel.findById(project.owner, { _id: 1 });

    if (owner && owner._id.toString() === user.id) return {
        ai: true,
        domains: ['All domains'],
        events: true,
        webAnalytics: true
    }

    const member = await TeamMemberModel.findOne({ project_id, user_id: user.id });

    if (!member) return {
        ai: true,
        domains: ['All domains'],
        events: true,
        webAnalytics: true
    }

    return {
        ai: false,
        domains: [],
        events: false,
        webAnalytics: false,
        ...(member.permission as any),
    } as TPermission

});