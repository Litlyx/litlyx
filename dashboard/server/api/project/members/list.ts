import { ProjectModel } from "@schema/ProjectSchema";
import { TeamMemberModel } from "@schema/TeamMemberSchema";
import { UserModel } from "@schema/UserSchema";
import { UserSettingsModel } from "@schema/UserSettings";
import StripeService from '~/server/services/StripeService';

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const currentActiveProject = await UserSettingsModel.findOne({ user_id: userData.id });
    if (!currentActiveProject) return setResponseStatus(event, 400, 'You need to select a project');

    const project_id = currentActiveProject.active_project_id;

    const project = await ProjectModel.findById(project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');

    const owner = await UserModel.findById(project.owner);
    if (!owner) return setResponseStatus(event, 400, 'No owner');

    const members = await TeamMemberModel.find({ project_id });

    const result: { email: string, name: string, role: string, pending: boolean, me: boolean }[] = [];

    result.push({
        email: owner.email,
        name: owner.name,
        role: 'OWNER',
        pending: false,
        me: userData.id === owner.id
    })

    for (const member of members) {
        const userMember = await UserModel.findById(member.user_id);
        if (!userMember) continue;
        result.push({
            email: userMember.email,
            name: userMember.name,
            role: member.role,
            pending: member.pending,
            me: userData.id === userMember.id
        })
    }

    return result;

});