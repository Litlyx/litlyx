import { ProjectModel, TProject } from "@schema/project/ProjectSchema";
import { ProjectCountModel } from "@schema/project/ProjectsCounts";
import { ProjectLimitModel } from "@schema/project/ProjectsLimits";
import { UserSettingsModel } from "@schema/UserSettings";
import StripeService from '~/server/services/StripeService';

export default defineEventHandler(async event => {

    const body = await readBody(event);

    const newProjectName = body.name.trim();

    if (!newProjectName) return setResponseStatus(event, 400, 'ProjectName too short');
    if (newProjectName.length < 2) return setResponseStatus(event, 400, 'ProjectName too short');

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const maxProjects = 20;

    const existingUserProjects = await ProjectModel.countDocuments({ owner: userData.id });
    if (existingUserProjects >= maxProjects) return setResponseStatus(event, 400, 'Already have max number of projects');

    if (StripeService.isDisabled()) {

        const project = await ProjectModel.create({
            owner: userData.id,
            name: newProjectName,
            premium: false,
            premium_type: 0,
            customer_id: 'DISABLED_MODE',
            subscription_id: "DISABLED_MODE",
            premium_expire_at: new Date(3000, 1, 1)
        });


        await ProjectCountModel.create({
            project_id: project._id,
            events: 0,
            visits: 0,
            sessions: 0
        });

        await ProjectLimitModel.updateOne({ project_id: project._id }, {
            events: 0,
            visits: 0,
            ai_messages: 0,
            limit: 10_000_000,
            ai_limit: 1_000_000,
            billing_start_at: Date.now(),
            billing_expire_at: new Date(3000, 1, 1)
        }, { upsert: true })

        return project.toJSON() as TProject;

    } else {

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
            visits: 0,
            sessions: 0
        });

        return project.toJSON() as TProject;

    }



});