import { AuthContext } from "./middleware/01-authorization";
import { ProjectModel } from "~/../shared/schema/ProjectSchema";
import { LITLYX_PROJECT_ID } from '@data/LITLYX'

export async function getUserProjectFromId(project_id: string, user: AuthContext | undefined) {
    if (project_id == LITLYX_PROJECT_ID) {
        const project = await ProjectModel.findOne({ _id: project_id });
        return project;
    } else {
        if (!user?.logged) return;
        const project = await ProjectModel.findOne({ _id: project_id, owner: user.id });
        return project;
    }


}