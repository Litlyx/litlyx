import { TeamMemberModel } from "~/shared/schema/TeamMemberSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'permission:member');
    const { project_id, user_id, user_email, project } = ctx;

    if (project.owner.toString() === user_id) {
        return { webAnalytics: true, domains: ['*'], ai: true, events: true }
    }

    //TODO: Create admin list
    if (user_email === 'helplitlyx@gmail.com') {
        return { webAnalytics: true, domains: ['*'], ai: true, events: true }
    }

    const meUserId = await TeamMemberModel.findOne({ project_id, user_id });
    if (meUserId) return meUserId.permission;

    const meEmail = await TeamMemberModel.findOne({ project_id, email: user_email });
    if (meEmail) return meEmail.permission;

    return { webAnalytics: false, domains: [], ai: false, events: false }

});