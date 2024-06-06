import { ProjectModel } from "@schema/ProjectSchema";
import { ProjectCountModel } from "@schema/ProjectsCounts";
import { ProjectLimitModel } from "@schema/ProjectsLimits";
import { UserModel } from "@schema/UserSchema";
import StripeService from '~/server/services/StripeService';

export default defineEventHandler(async event => {
    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const { project_id } = getQuery(event);
    if (!project_id) return setResponseStatus(event, 400, 'ProjectId is required');

    const project = await ProjectModel.findById(project_id);
    const limits = await ProjectLimitModel.findOne({ project_id });
    const counts = await ProjectCountModel.findOne({ project_id });
    const user = await UserModel.findOne({ project_id });

    const subscription =
        project?.subscription_id ?
            await StripeService.getSubscription(project.subscription_id) : 'NONE';

    const customer =
        project?.customer_id ?
            await StripeService.getCustomer(project.customer_id) : 'NONE';

    return { project, limits, counts, user, subscription, customer }
    
});