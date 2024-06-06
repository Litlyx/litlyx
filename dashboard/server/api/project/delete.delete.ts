import { ProjectModel } from "@schema/ProjectSchema";
import { ProjectCountModel } from "@schema/ProjectsCounts";
import { ProjectLimitModel } from "@schema/ProjectsLimits";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { LimitNotifyModel } from "@schema/broker/LimitNotifySchema";
import StripeService from '~/server/services/StripeService';
import { AiChatModel } from "@schema/ai/AiChatSchema";

export default defineEventHandler(async event => {

    const body = await readBody(event);

    const project_id = body.project_id;

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const project = await ProjectModel.findById(project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not exist');

    const projects = await ProjectModel.countDocuments({ owner: userData.id });
    if (projects == 1) return setResponseStatus(event, 400, 'Cannot delete last project');

    if (project.premium === true) return setResponseStatus(event, 400, 'Cannot delete premium project');

    await StripeService.deleteCustomer(project.customer_id);

    const projectDeletation = await ProjectModel.deleteOne({ _id: project_id });
    const countDeletation = await ProjectCountModel.deleteMany({ project_id });
    const limitdeletation = await ProjectLimitModel.deleteMany({ project_id });
    const sessionsDeletation = await SessionModel.deleteMany({ project_id });
    const notifiesDeletation = await LimitNotifyModel.deleteMany({ project_id });
    const aiChatsDeletation = await AiChatModel.deleteMany({ project_id });

    const ok = countDeletation.acknowledged && limitdeletation.acknowledged &&
        projectDeletation.acknowledged && sessionsDeletation.acknowledged && notifiesDeletation.acknowledged && aiChatsDeletation.acknowledged

    return {
        ok,
        data: [
            countDeletation.acknowledged,
            limitdeletation.acknowledged,
            projectDeletation.acknowledged,
            sessionsDeletation.acknowledged,
            notifiesDeletation.acknowledged,
            aiChatsDeletation.acknowledged
        ]
    };

});