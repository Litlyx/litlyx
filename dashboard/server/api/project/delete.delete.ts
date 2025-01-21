import { ProjectModel } from "@schema/project/ProjectSchema";
import { ProjectCountModel } from "@schema/project/ProjectsCounts";
import { ProjectLimitModel } from "@schema/project/ProjectsLimits";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { LimitNotifyModel } from "@schema/broker/LimitNotifySchema";
import StripeService from '~/server/services/StripeService';
import { AiChatModel } from "@schema/ai/AiChatSchema";

export default defineEventHandler(async event => {

    const data = await getRequestDataOld(event, { requireSchema: false, allowGuests: false, allowLitlyx: false });
    if (!data) return;

    const { project, user, project_id } = data;

    const projects = await ProjectModel.countDocuments({ owner: user.id });
    if (projects == 1) return setResponseStatus(event, 400, 'Cannot delete last project');

    if (project.premium === true) return setResponseStatus(event, 400, 'Cannot delete premium project');

    if (project.customer_id) {
        await StripeService.deleteCustomer(project.customer_id);
    }

    const projectDeletation = ProjectModel.deleteOne({ _id: project_id });
    const countDeletation = ProjectCountModel.deleteMany({ project_id });
    const limitdeletation = ProjectLimitModel.deleteMany({ project_id });
    const sessionsDeletation = SessionModel.deleteMany({ project_id });
    const notifiesDeletation = LimitNotifyModel.deleteMany({ project_id });
    const aiChatsDeletation = AiChatModel.deleteMany({ project_id });

    const results = await Promise.all([
        projectDeletation,
        countDeletation,
        limitdeletation,
        sessionsDeletation,
        notifiesDeletation,
        aiChatsDeletation
    ])

    return { data: results };

});