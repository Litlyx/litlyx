import { ProjectModel } from "@schema/ProjectSchema";
import { UserModel } from "@schema/UserSchema";


export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;


    const projectsCount = await ProjectModel.countDocuments({});
    const usersCount = await UserModel.countDocuments({});

    return { users: usersCount, projects: projectsCount }

});