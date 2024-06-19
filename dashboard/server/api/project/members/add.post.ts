import { ProjectModel } from "@schema/ProjectSchema";
import { TeamMemberModel } from "@schema/TeamMemberSchema";
import { UserModel } from "@schema/UserSchema";
import { UserSettingsModel } from "@schema/UserSettings";

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const currentActiveProject = await UserSettingsModel.findOne({ user_id: userData.id });
    if (!currentActiveProject) return setResponseStatus(event, 400, 'You need to select a project');

    const project_id = currentActiveProject.active_project_id;

    const project = await ProjectModel.findById(project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');

    if (project.owner.toString() != userData.id) {
        return setResponseStatus(event, 400, 'You are not the owner');
    }

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