import { ProjectCountModel } from '../schema/ProjectsCounts';
import { ProjectModel } from '../schema/ProjectSchema';
import { LimitNotifyModel } from '../schema/broker/LimitNotifySchema';
import { PREMIUM_LIMITS, getPlanFromPremiumType } from '../data/PREMIUM_LIMITS';
import { MONTH } from '../utilts/TIME';


export async function getCurrentProjectCountId(project_id: string) {
    const projectCount = await ProjectCountModel.findOne({ project_id }, { _id: 1 }, { sort: { billing_expire_at: -1 } });
    return projectCount?._id.toString();
}

export async function getAllLimitsFromProjectId(project_id: string) {
    const targetProject = await ProjectModel.findById(project_id, {
        premium: 1, premium_type: 1, premium_expire_at: 1
    });
    if (!targetProject) return PREMIUM_LIMITS.FREE;
    if (!targetProject.premium) return PREMIUM_LIMITS.FREE;
    const plan = getPlanFromPremiumType(targetProject.premium_type);
    return PREMIUM_LIMITS[plan.tag];
}

export async function checkProjectCount(project_id: string) {

    const targetProject = await ProjectModel.findById(project_id, {
        premium: 1, premium_type: 1, premium_expire_at: 1
    });

    if (!targetProject) return;

    if (new Date(targetProject.premium_expire_at).getTime() < Date.now()) {
        await ProjectModel.updateOne({ _id: project_id }, {
            premium: false,
            $unset: {
                premium_type: 1,
                premium_expire_at: 1
            },
        });
    }

    const limits = await getAllLimitsFromProjectId(project_id);

    const projectCounts = await ProjectCountModel.findOne({ project_id }, {}, { sort: { billing_expire_at: -1 } });

    const billingExpireAt = projectCounts ? new Date(projectCounts.billing_expire_at).getTime() : -1;

    if (projectCounts && Date.now() < billingExpireAt) {
        if (projectCounts.ai_limit) return projectCounts.toJSON();
        projectCounts.ai_limit = limits.AI_MESSAGE_LIMIT;
        const saved = await projectCounts.save();
        return saved.toJSON();
    }

    const newProjectCounts = await ProjectCountModel.create({
        project_id,
        events: 0,
        visits: 0,
        limit: limits.COUNT_LIMIT,
        ai_messages: 0,
        ai_limit: limits.AI_MESSAGE_LIMIT,
        billing_start_at: projectCounts ? billingExpireAt : Date.now(),
        billing_expire_at: (projectCounts ? billingExpireAt : Date.now()) + MONTH
    });

    await LimitNotifyModel.updateOne({ project_id }, { limit1: false, limit2: false, limit3: false });

    return newProjectCounts.toJSON();


}