
import { ProjectModel } from "@schema/project/ProjectSchema";
import { ProjectCountModel } from "@schema/project/ProjectsCounts";
import { ProjectLimitModel } from "@schema/project/ProjectsLimits";
import { UserSettingsModel } from "@schema/UserSettings";
import { AiChatModel } from "@schema/ai/AiChatSchema";
import { LimitNotifyModel } from "@schema/broker/LimitNotifySchema";
import { SessionModel } from "@schema/metrics/SessionSchema";
import StripeService from "~/server/services/StripeService";
import { UserModel } from "@schema/UserSchema";
import { AddressBlacklistModel } from "~/shared/schema/shields/AddressBlacklistSchema";
import { DomainWhitelistModel } from "~/shared/schema/shields/DomainWhitelistSchema";
import { CountryBlacklistModel } from "~/shared/schema/shields/CountryBlacklistSchema";
import { BotTrafficOptionModel } from "~/shared/schema/shields/BotTrafficOptionSchema";
import { TeamMemberModel } from "~/shared/schema/TeamMemberSchema";
import { PasswordModel } from "~/shared/schema/PasswordSchema";

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;

    const projects = await ProjectModel.find({ owner: userData.id });

    const premiumProjects = projects.filter(e => { return e.premium && e.premium_type != 0 }).length;
    if (premiumProjects > 0) return setResponseStatus(event, 400, 'Cannot delete an account with a premium project');

    const membersDeletation = await TeamMemberModel.deleteMany({ user_id: userData.id });
    const membersEmailDeletation = await TeamMemberModel.deleteMany({ email: userData.user.email });

    const passwordDeletation = await PasswordModel.deleteMany({ user_id: userData.id });

    for (const project of projects) {
        const project_id = project._id;
        await StripeService.deleteCustomer(project.customer_id);
        const projectDeletation = await ProjectModel.deleteOne({ _id: project_id });
        const userSettingsDeletation = await UserSettingsModel.deleteOne({ project_id });
        const countDeletation = await ProjectCountModel.deleteMany({ project_id });
        const limitdeletation = await ProjectLimitModel.deleteMany({ project_id });
        const sessionsDeletation = await SessionModel.deleteMany({ project_id });
        const notifiesDeletation = await LimitNotifyModel.deleteMany({ project_id });
        const aiChatsDeletation = await AiChatModel.deleteMany({ project_id });

        //Shields
        const addressBlacklistDeletation = await AddressBlacklistModel.deleteMany({ project_id });
        const botTrafficOptionsDeletation = await BotTrafficOptionModel.deleteMany({ project_id });
        const countryBlacklistDeletation = await CountryBlacklistModel.deleteMany({ project_id });
        const domainWhitelistDeletation = await DomainWhitelistModel.deleteMany({ project_id });


        const userDeletation = await UserModel.deleteOne({ _id: userData.id });

    }

    return { ok: true };


});