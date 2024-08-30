import { ProjectModel } from "@schema/ProjectSchema";
import { UserModel } from "@schema/UserSchema";
import { LimitNotifyModel } from "@schema/broker/LimitNotifySchema";
import EmailService from '@services/EmailService';
import { requireEnv } from "../../shared/utilts/requireEnv";
import { TProjectLimit } from "@schema/ProjectsLimits";

if (process.env.EMAIL_SERVICE) {
    EmailService.init(requireEnv('BREVO_API_KEY'));
}

export async function checkLimitsForEmail(projectCounts: TProjectLimit) {

    if ((projectCounts.visits + projectCounts.events) >= (projectCounts.limit / 2)) {
        const notify = await LimitNotifyModel.findOne({ project_id: projectCounts._id });
        if (notify && notify.limit1 === true) return;
        const project = await ProjectModel.findById(projectCounts.project_id);
        if (!project) return;
        const owner = await UserModel.findById(project.owner);
        if (!owner) return;
        if (process.env.EMAIL_SERVICE) await EmailService.sendLimitEmail50(owner.email);
        await LimitNotifyModel.updateOne({ project_id: projectCounts._id }, { limit1: true, limit2: false, limit3: false }, { upsert: true });
    }

}