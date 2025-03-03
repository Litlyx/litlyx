import { TeamMemberModel } from "~/shared/schema/TeamMemberSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return [];

    const body = await readBody(event);

    const { member_id, webAnalytics, events, ai, domains } = body;

    if (!member_id) return setResponseStatus(event, 400, 'permission_id is required');

    const edited = await TeamMemberModel.updateOne({ _id: member_id }, {
        permission: {
            webAnalytics,
            events,
            ai,
            domains
        }
    });

    return { ok: edited.modifiedCount == 1 }

});