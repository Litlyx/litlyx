
import { TeamMemberModel } from "@schema/TeamMemberSchema";
import { UserModel } from "@schema/UserSchema";


export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');
    const { project_id } = ctx;

    const { email } = await readBody(event);

    const user = await UserModel.findOne({ email });
    if (user) {
        await TeamMemberModel.deleteOne({ project_id, user_id: user.id });
    } else {
        await TeamMemberModel.deleteOne({ project_id, email: email });
    }

    return { ok: true }

});