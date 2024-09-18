import { ProjectModel } from "@schema/ProjectSchema";
import { UserModel } from "@schema/UserSchema";
import { LimitNotifyModel } from "@schema/broker/LimitNotifySchema";
import EmailService from '@services/EmailService';
import { requireEnv } from "@utils/requireEnv";
import { TProjectLimit } from "@schema/ProjectsLimits";

if (process.env.EMAIL_SERVICE) {
    EmailService.init(requireEnv('BREVO_API_KEY'));
}

export async function checkLimitsForEmail(projectCounts: TProjectLimit) {

    const project_id = projectCounts.project_id;
    const hasNotifyEntry = await LimitNotifyModel.findOne({ project_id });
    if (!hasNotifyEntry) {
        await LimitNotifyModel.create({ project_id, limit1: false, limit2: false, limit3: false })
    }

    if ((projectCounts.visits + projectCounts.events) >= (projectCounts.limit)) {

        if (hasNotifyEntry.limit3 === true) return;

        const project = await ProjectModel.findById(project_id);
        if (!project) return;

        const owner = await UserModel.findById(project.owner);
        if (!owner) return;

        if (process.env.EMAIL_SERVICE) await EmailService.sendLimitEmailMax(owner.email, project.name);
        await LimitNotifyModel.updateOne({ project_id: projectCounts.project_id }, { limit1: true, limit2: true, limit3: true });

    } else if ((projectCounts.visits + projectCounts.events) >= (projectCounts.limit * 0.9)) {

        if (hasNotifyEntry.limit2 === true) return;

        const project = await ProjectModel.findById(project_id);
        if (!project) return;

        const owner = await UserModel.findById(project.owner);
        if (!owner) return;

        if (process.env.EMAIL_SERVICE) await EmailService.sendLimitEmail90(owner.email, project.name);
        await LimitNotifyModel.updateOne({ project_id: projectCounts.project_id }, { limit1: true, limit2: true, limit3: false });

    } else if ((projectCounts.visits + projectCounts.events) >= (projectCounts.limit * 0.5)) {

        if (hasNotifyEntry.limit1 === true) return;

        const project = await ProjectModel.findById(project_id);
        if (!project) return;

        const owner = await UserModel.findById(project.owner);
        if (!owner) return;

        if (process.env.EMAIL_SERVICE) await EmailService.sendLimitEmail50(owner.email, project.name);
        await LimitNotifyModel.updateOne({ project_id: projectCounts.project_id }, { limit1: true, limit2: false, limit3: false });

    }




}
