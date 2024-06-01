import { ProjectModel } from "@schema/ProjectSchema";

export default defineEventHandler(async event => {

    const body = await readBody(event);

    const projectId = body.project_id;

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const projects = await ProjectModel.countDocuments({ owner: userData.id });
    if (projects == 1) return setResponseStatus(event, 400, 'Cannot delete last project');

    const deletation = await ProjectModel.deleteOne({ owner: userData.id, _id: projectId });
    return { ok: deletation.acknowledged };

});