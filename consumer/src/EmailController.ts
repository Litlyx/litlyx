import { ProjectModel } from "./shared/schema/project/ProjectSchema";
import { UserModel } from "./shared/schema/UserSchema";
import { LimitNotifyModel } from "./shared/schema/broker/LimitNotifySchema";
import { EmailService } from './shared/services/EmailService';
import { EmailServiceHelper } from "./EmailServiceHelper";
import { TUserLimit } from "./shared/schema/UserLimitSchema";


export async function checkLimitsForEmail(projectCounts: TUserLimit) {

    const user_id = projectCounts.user_id;

    const hasNotifyEntry = await LimitNotifyModel.findOne({ user_id });
    if (!hasNotifyEntry) {
        await LimitNotifyModel.create({ user_id, limit1: false, limit2: false, limit3: false })
    }

    const owner = await UserModel.findById(project.owner);
    if (!owner) return;

    const userName = owner.given_name || owner.name || 'no_name';

    if ((projectCounts.visits + projectCounts.events) >= (projectCounts.limit)) {

        if (hasNotifyEntry.limit3 === true) return;

        setImmediate(() => {
            const emailData = EmailService.getEmailServerInfo('limit_max', { target: owner.email, userName });
            EmailServiceHelper.sendEmail(emailData);
        });

        await LimitNotifyModel.updateOne({ user_id }, { limit1: true, limit2: true, limit3: true });

    } else if ((projectCounts.visits + projectCounts.events) >= (projectCounts.limit * 0.9)) {

        if (hasNotifyEntry.limit2 === true) return;

        setImmediate(() => {
            const emailData = EmailService.getEmailServerInfo('limit_90', { target: owner.email, userName });
            EmailServiceHelper.sendEmail(emailData);
        });

        await LimitNotifyModel.updateOne({ user_id }, { limit1: true, limit2: true, limit3: false });

    } else if ((projectCounts.visits + projectCounts.events) >= (projectCounts.limit * 0.5)) {

        if (hasNotifyEntry.limit1 === true) return;

        setImmediate(() => {
            const emailData = EmailService.getEmailServerInfo('limit_50', { target: owner.email, userName });
            EmailServiceHelper.sendEmail(emailData);
        });

        await LimitNotifyModel.updateOne({ user_id }, { limit1: true, limit2: false, limit3: false });

    }




}
