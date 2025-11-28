import { TeamMemberModel } from "~/shared/schema/TeamMemberSchema";


export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');

    const { user_id, project } = ctx;

    const body = await readBody(event);
    const { member_id, webAnalytics, events, ai, domains } = body;

    const isOwner = user_id === project.owner.toString();
    if (!isOwner) throw createError({ status: 403, message: 'Only owner can change roles' })

    if (!member_id) return setResponseStatus(event, 400, 'member_id is required');

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