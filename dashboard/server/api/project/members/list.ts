import { ProjectModel } from "@schema/ProjectSchema";
import { TeamMemberModel } from "@schema/TeamMemberSchema";
import { UserModel } from "@schema/UserSchema";
import { UserSettingsModel } from "@schema/UserSettings";
import StripeService from '~/server/services/StripeService';

export default defineEventHandler(async event => {

    const data = await getRequestData(event, { requireSchema: false });
    if (!data) return;

    const { project_id, project, user } = data;

    const owner = await UserModel.findById(project.owner);
    if (!owner) return setResponseStatus(event, 400, 'No owner');

    const members = await TeamMemberModel.find({ project_id });

    const result: { email: string, name: string, role: string, pending: boolean, me: boolean }[] = [];

    result.push({
        email: owner.email,
        name: owner.name,
        role: 'OWNER',
        pending: false,
        me: user.id === owner.id
    })

    for (const member of members) {
        const userMember = await UserModel.findById(member.user_id);
        if (!userMember) continue;
        result.push({
            email: userMember.email,
            name: userMember.name,
            role: member.role,
            pending: member.pending,
            me: user.id === userMember.id
        })
    }

    return result;

});