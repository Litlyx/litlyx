import { EventModel } from "@schema/metrics/EventSchema";
import { Redis } from "~/server/services/CacheService";
import { executeTimelineAggregation } from "~/server/services/TimelineService";
import { TeamMemberModel, TeamMemberRole, TPermission } from "~/shared/schema/TeamMemberSchema";
import { TUser, UserModel } from "~/shared/schema/UserSchema";


export type MemberWithPermissions = {
    id: string | null,
    email: string,
    role: TeamMemberRole,
    pending: boolean,
    me: boolean,
    permission: TPermission
}


export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');
    const { project_id, user_id, user_email, project } = ctx;

    const result: MemberWithPermissions[] = [];

    const members = await TeamMemberModel.find({ project_id });

    result.push({
        id: user_id,
        email: user_email,
        role: 'OWNER',
        me: user_id === project.owner.toString(),
        pending: false,
        permission: {
            webAnalytics: true,
            domains: ['*'],
            ai: true,
            events: true
        }
    })

    for (const member of members) {

        let userMember: TUser | null;

        if (member.user_id) {
            userMember = await UserModel.findOne({ _id: member.user_id });
        } else {
            userMember = await UserModel.findOne({ email: member.email });
        }

        const permission: TPermission = {
            webAnalytics: member.permission?.webAnalytics || false,
            events: member.permission?.events || false,
            ai: member.permission?.ai || false,
            domains: member.permission?.domains || []
        }

        if (userMember) {
            result.push({
                id: member.id,
                email: userMember.email || member.email || 'NO_EMAIL',
                role: member.role,
                pending: member.pending,
                me: user_id === ((userMember as any).id.toString() || member.user_id || 'NO_ID'),
                permission
            })
        } else {
            result.push({
                id: member.id,
                email: member.email ?? 'error',
                role: member.role,
                pending: member.pending,
                me: false,
                permission: member.permission
            })
        }


    }

    return result;

});