import { TeamMemberModel } from "~/shared/schema/TeamMemberSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], []);
    if (!data) return [];

    const body = await readBody(event);

    const { project_id } = body;
    if (!project_id) return setResponseStatus(event, 400, 'project_id is required');

    const member = await TeamMemberModel.deleteOne({ project_id, user_id: data.user.id });
    if (!member) return setResponseStatus(event, 400, 'member not found');

    return { ok: true };

});