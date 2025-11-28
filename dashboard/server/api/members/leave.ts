import { TeamMemberModel } from "~/shared/schema/TeamMemberSchema";

export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'pid', 'permission:member');
    const { project_id, user_id } = ctx;
    await TeamMemberModel.deleteOne({ project_id, user_id });
});