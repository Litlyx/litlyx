import { ProjectModel } from "@schema/ProjectSchema";
import { ProjectCountModel } from "@schema/ProjectsCounts";
import { ProjectLimitModel } from "@schema/ProjectsLimits";
import StripeService from '~/server/services/StripeService';

export default defineEventHandler(async event => {

    const body = await readBody(event);

    const projectId = body.project_id;

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const project = await ProjectModel.findById(projectId);
    if (!project) return setResponseStatus(event, 400, 'Project not exist');

    const projects = await ProjectModel.countDocuments({ owner: userData.id });
    if (projects == 1) return setResponseStatus(event, 400, 'Cannot delete last project');

    if (project.premium === true) return setResponseStatus(event, 400, 'Cannot delete premium project');

    await StripeService.deleteCustomer(project.customer_id);

    const countDeletation = await ProjectCountModel.deleteOne({ owner: userData.id, _id: projectId });
    const limitdeletation = await ProjectLimitModel.deleteOne({ owner: userData.id, _id: projectId });
    const projectDeletation = await ProjectModel.deleteOne({ owner: userData.id, _id: projectId });

    const ok = countDeletation.acknowledged && limitdeletation.acknowledged && projectDeletation.acknowledged
  
    return {
        ok,
        data: [
            countDeletation.acknowledged,
            limitdeletation.acknowledged,
            projectDeletation.acknowledged
        ]
    };

});