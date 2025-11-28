import { TeamMemberModel } from "~/shared/schema/TeamMemberSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'flag:allowAnonRegistered');
    const { user_id, user_email } = ctx;

    const body = await readBody(event);

    const { project_id } = body;
    if (!project_id) throw createError({ status: 400, message: 'project_id is required' });

    const member = await TeamMemberModel.findOne({
        project_id, $or: [
            { user_id },
            { email: user_email }
        ]
    });
    if (!member) throw createError({ status: 400, message: 'Member not found' });

    member.pending = false;
    await member.save();

    return { ok: true };

});