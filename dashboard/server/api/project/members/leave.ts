
import { TeamMemberModel } from "@schema/TeamMemberSchema";


export default defineEventHandler(async event => {

    const data = await getRequestData(event, { requireSchema: false, allowGuests: false, allowLitlyx: false });
    if (!data) return;

    const { project_id, user } = data;

    await TeamMemberModel.deleteOne({ project_id, user_id: user.id });

    return { ok: true }

});