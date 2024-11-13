import { ProjectModel } from "@schema/ProjectSchema";
import { UserModel } from "@schema/UserSchema";


export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const { from } = getQuery(event);

    const date = new Date(parseInt(from as any));

    const projectsCount = await ProjectModel.countDocuments({
        created_at: { $gte: date }
    });
    const usersCount = await UserModel.countDocuments({
        created_at: { $gte: date }
    });

    return { users: usersCount, projects: projectsCount }

});