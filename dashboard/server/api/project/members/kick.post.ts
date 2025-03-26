
import { TeamMemberModel } from "@schema/TeamMemberSchema";
import { UserModel } from "@schema/UserSchema";


export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;

    const { project_id } = data;

    const { email } = await readBody(event);

    const user = await UserModel.findOne({ email });
    if (!user) return setResponseStatus(event, 400, 'Email not found');

    await TeamMemberModel.deleteOne({ project_id, user_id: user.id });
    await TeamMemberModel.deleteOne({ project_id, email: email });

    return { ok: true }

});