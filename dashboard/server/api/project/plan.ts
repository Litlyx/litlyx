import { ProjectModel } from "@schema/ProjectSchema";
import { ProjectLimitModel } from "@schema/ProjectsLimits";
import { UserSettingsModel } from "@schema/UserSettings";
import StripeService from '~/server/services/StripeService';

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const currentActiveProject = await UserSettingsModel.findOne({ user_id: userData.id });
    if (!currentActiveProject) return setResponseStatus(event, 400, 'You need to select a project');

    const project_id = currentActiveProject.active_project_id;

    const project = await ProjectModel.findById(project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');


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