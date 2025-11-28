
import { ProjectModel } from "@schema/project/ProjectSchema";
import { ProjectCountModel } from "@schema/project/ProjectsCounts";
import { UserLimitModel } from "@schema/UserLimitSchema";
import { UserSettingsModel } from "@schema/UserSettings";
import { AiChatModel } from "@schema/ai/AiChatSchema";
import { LimitNotifyModel } from "@schema/broker/LimitNotifySchema";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { UserModel } from "@schema/UserSchema";
import { AddressBlacklistModel } from "~/shared/schema/shields/AddressBlacklistSchema";
import { DomainWhitelistModel } from "~/shared/schema/shields/DomainWhitelistSchema";
import { CountryBlacklistModel } from "~/shared/schema/shields/CountryBlacklistSchema";
import { BotTrafficOptionModel } from "~/shared/schema/shields/BotTrafficOptionSchema";
import { TeamMemberModel } from "~/shared/schema/TeamMemberSchema";
import { PasswordModel } from "~/shared/schema/PasswordSchema";
import { PremiumModel } from "~/shared/schema/PremiumSchema";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import { EventModel } from "~/shared/schema/metrics/EventSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event);

    const projects = await ProjectModel.find({ owner: ctx.user_id });

    const premium = await PremiumModel.findOne({ user_id: ctx.user_id });
    if (!premium) throw createError({ status: 400, message: 'Cannot find premium model. Please contact support.' });

    if (premium.premium_type !== 0 && premium.premium_type !== 7006 && premium.premium_type !== 7999) {
        throw createError({ status: 400, message: 'Cannot delete an account with a premium project' });
    }


    const membersDeletation = await TeamMemberModel.deleteMany({ user_id: ctx.user_id });
    const membersEmailDeletation = await TeamMemberModel.deleteMany({ email: ctx.user_email });

    const passwordDeletation = await PasswordModel.deleteMany({ user_id: ctx.user_id });

    const limitdeletation = await UserLimitModel.deleteMany({ user_id: ctx.user_id });
    const notifiesDeletation = await LimitNotifyModel.deleteMany({ user_id: ctx.user_id });

    try {
        const { payments } = useTRPC();
        if (premium) await payments.customer.delete.mutate({ customer_id: premium.customer_id });
    } catch (ex) {
        console.error(ex);
    }



    for (const project of projects) {
        const project_id = project._id;

        const projectDeletation = await ProjectModel.deleteOne({ _id: project_id });
        const userSettingsDeletation = await UserSettingsModel.deleteOne({ project_id });
        const countDeletation = await ProjectCountModel.deleteMany({ project_id });

        const sessionsDeletation = SessionModel.deleteMany({ project_id });
        const visitsDeletation = VisitModel.deleteMany({ project_id });
        const eventsDeletation = EventModel.deleteMany({ project_id });

        const aiChatsDeletation = AiChatModel.deleteMany({ project_id });

        //Shields
        const addressBlacklistDeletation = AddressBlacklistModel.deleteMany({ project_id });
        const botTrafficOptionsDeletation = BotTrafficOptionModel.deleteMany({ project_id });
        const countryBlacklistDeletation = CountryBlacklistModel.deleteMany({ project_id });
        const domainWhitelistDeletation = DomainWhitelistModel.deleteMany({ project_id });

    }

    const premiumDeletation = await PremiumModel.deleteOne({ user_id: ctx.user_id });
    const userDeletation = await UserModel.deleteOne({ _id: ctx.user_id });

    return { ok: true };


});