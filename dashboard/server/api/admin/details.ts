import { ProjectModel } from "@schema/project/ProjectSchema";
import { ProjectCountModel } from "@schema/project/ProjectsCounts";
import { UserLimitModel } from "@schema/UserLimitSchema";
import { UserModel } from "@schema/UserSchema";
import { PremiumModel } from "~/shared/schema/PremiumSchema";

export default defineEventHandler(async event => {
    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const { project_id } = getQuery(event);
    if (!project_id) return setResponseStatus(event, 400, 'ProjectId is required');

    const project = await ProjectModel.findById(project_id);
    const limits = await UserLimitModel.findOne({ user_id: userData.id });
    const counts = await ProjectCountModel.findOne({ project_id });
    const user = await UserModel.findOne({ project_id });

    const premium = await PremiumModel.findOne({ user_id: userData.id });

    // const subscription =
    //     premium?.subscription_id ?
    //         await StripeService.getSubscription(premium.subscription_id) : 'NONE';

    // const customer =
    //     premium?.customer_id ?
    //         await StripeService.getCustomer(premium.customer_id) : 'NONE';

    return {
        project, limits, counts, user,
        subscription: '',
        customer: ''
    }

});