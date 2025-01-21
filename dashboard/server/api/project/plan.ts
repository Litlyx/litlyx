import { ProjectLimitModel } from "@schema/project/ProjectsLimits";
import StripeService from '~/server/services/StripeService';

export default defineEventHandler(async event => {

    const data = await getRequestDataOld(event, { requireSchema: false, allowLitlyx: false });
    if (!data) return;

    const { project, project_id } = data;

    if (project.subscription_id === 'onetime') {

        const projectLimits = await ProjectLimitModel.findOne({ project_id });
        if (!projectLimits) return setResponseStatus(event, 400, 'Project limits not found');

        const result = {
            premium: project.premium,
            premium_type: project.premium_type,
            billing_start_at: projectLimits.billing_start_at,
            billing_expire_at: projectLimits.billing_expire_at,
            limit: projectLimits.limit,
            count: projectLimits.events + projectLimits.visits,
            subscription_status: StripeService.isDisabled() ? 'Disabled mode' : ('One time payment')
        }

        return result;
    }

    const subscription = await StripeService.getSubscription(project.subscription_id);

    const projectLimits = await ProjectLimitModel.findOne({ project_id });
    if (!projectLimits) return setResponseStatus(event, 400, 'Project limits not found');


    const result = {
        premium: project.premium,
        premium_type: project.premium_type,
        billing_start_at: projectLimits.billing_start_at,
        billing_expire_at: projectLimits.billing_expire_at,
        limit: projectLimits.limit,
        count: projectLimits.events + projectLimits.visits,
        subscription_status: StripeService.isDisabled() ? 'Disabled mode' : (subscription?.status ?? '?')
    }

    return result;

});