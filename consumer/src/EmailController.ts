import { ProjectModel } from "./shared/schema/project/ProjectSchema";
import { UserModel } from "./shared/schema/UserSchema";
import { LimitNotifyModel } from "./shared/schema/broker/LimitNotifySchema";
import { EmailService } from './shared/services/EmailService';
import { requireEnv } from "./shared/utils/requireEnv";
import { TProjectLimit } from "./shared/schema/project/ProjectsLimits";
import { EmailServiceHelper } from "./EmailServiceHelper";


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

        setImmediate(() => {
            const emailData = EmailService.getEmailServerInfo('limit_max', {
                target: owner.email,
                projectName: project.name
            });
            EmailServiceHelper.sendEmail(emailData);
        });

        await LimitNotifyModel.updateOne({ project_id: projectCounts.project_id }, { limit1: true, limit2: true, limit3: true });

    } else if ((projectCounts.visits + projectCounts.events) >= (projectCounts.limit * 0.9)) {

        if (hasNotifyEntry.limit2 === true) return;

        const project = await ProjectModel.findById(project_id);
        if (!project) return;

        const owner = await UserModel.findById(project.owner);
        if (!owner) return;

        setImmediate(() => {
            const emailData = EmailService.getEmailServerInfo('limit_90', {
                target: owner.email,
                projectName: project.name
            });
            EmailServiceHelper.sendEmail(emailData);
        });

        await LimitNotifyModel.updateOne({ project_id: projectCounts.project_id }, { limit1: true, limit2: true, limit3: false });

    } else if ((projectCounts.visits + projectCounts.events) >= (projectCounts.limit * 0.5)) {

        if (hasNotifyEntry.limit1 === true) return;

        const project = await ProjectModel.findById(project_id);
        if (!project) return;

        const owner = await UserModel.findById(project.owner);
        if (!owner) return;

        setImmediate(() => {
            const emailData = EmailService.getEmailServerInfo('limit_50', {
                target: owner.email,
                projectName: project.name
            });
            EmailServiceHelper.sendEmail(emailData);
        });
        
        await LimitNotifyModel.updateOne({ project_id: projectCounts.project_id }, { limit1: true, limit2: false, limit3: false });

    }




}
