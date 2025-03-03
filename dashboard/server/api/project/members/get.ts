
import { TeamMemberModel, TPermission, TTeamMember } from "@schema/TeamMemberSchema";

export default defineEventHandler(async event => {
    const data = await getRequestData(event, []);
    if (!data) return;
    const { member_id } = getQuery(event);
    const member = await TeamMemberModel.findById(member_id);
    if (!member) return setResponseStatus(event, 400, 'Cannot get member');

    const resultPermission: TPermission = {
        ai: false,
        domains: [],
        events: false,
        webAnalytics: false
    }

    return {
        permission: resultPermission,
        ...member.toJSON() as any
    } as TTeamMember

});