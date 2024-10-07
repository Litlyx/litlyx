
import { TeamMemberModel } from "@schema/TeamMemberSchema";
import { UserModel } from "@schema/UserSchema";

export default defineEventHandler(async event => {


    const data = await getRequestData(event, { requireSchema: false, allowGuests: false, allowLitlyx: false });
    if (!data) return;

    const { project_id } = data;

    const { email } = await readBody(event);

    const targetUser = await UserModel.findOne({ email });
    if (!targetUser) return setResponseStatus(event, 400, 'No user with this email');


    await TeamMemberModel.create({
        project_id,
        user_id: targetUser.id,
        pending: true,
        role: 'GUEST'
    });

    return { ok: true };

});