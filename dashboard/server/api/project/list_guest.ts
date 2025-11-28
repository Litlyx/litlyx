import { ProjectModel, TProject } from "@schema/project/ProjectSchema";
import { TeamMemberModel } from "~/shared/schema/TeamMemberSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event);
    const { user_id, user_email } = ctx;

    const members = await TeamMemberModel.find({
        $or: [{ user_id }, { email: user_email }],
        pending: false
    });

    const projects = await ProjectModel.find({ _id: { $in: members.map(e => e.project_id) } });
    return projects.map(e => e.toJSON()) as TProject[];

});