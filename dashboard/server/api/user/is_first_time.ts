import { ProjectModel } from "@schema/project/ProjectSchema";
import { AuthContext } from "~/server/middleware/01-authorization";

export default defineEventHandler(async event => {
    const userData: AuthContext = getRequestUser(event) as any;
    if (!userData.logged) return;
    const userProjects = await ProjectModel.countDocuments({ owner: userData.id });
    return userProjects == 0;
});