import { ProjectModel, TProject } from "@schema/ProjectSchema";
import { ProjectCountModel } from "@schema/ProjectsCounts";
import { UserSettingsModel } from "@schema/UserSettings";
import StripeService from '~/server/services/StripeService';

export default defineEventHandler(async event => {

    const body = await readBody(event);

    const newProjectName = body.name;

    if (!newProjectName) return setResponseStatus(event, 400, 'ProjectName too short');
    if (newProjectName.length < 2) return setResponseStatus(event, 400, 'ProjectName too short');

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const userSettings = await UserSettingsModel.findOne({ user_id: userData.id }, { max_projects: true });

    const maxProjects = userSettings?.max_projects || 3;

    const existingUserProjects = await ProjectModel.countDocuments({ owner: userData.id });
    if (existingUserProjects >= maxProjects) return setResponseStatus(event, 400, 'Already have max number of projects');

    const customer = await StripeService.createCustomer(userData.user.email);
    if (!customer) return setResponseStatus(event, 400, 'Error creating customer');

    const subscription = await StripeService.createFreeSubscription(customer.id);
    if (!subscription) return setResponseStatus(event, 400, 'Error creating subscription');

    const project = await ProjectModel.create({
        owner: userData.id,
        name: newProjectName,
        premium: false,
        premium_type: 0,
        customer_id: customer.id,
        subscription_id: subscription.id,
        premium_expire_at: subscription.current_period_end * 1000
    });

    await ProjectCountModel.create({
        project_id: project._id,
        events: 0,
        visits: 0
    });

    return project.toJSON() as TProject;

});