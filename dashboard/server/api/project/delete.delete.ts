
import { ProjectModel } from "@schema/project/ProjectSchema";
import { ProjectCountModel } from "@schema/project/ProjectsCounts";
import { UserSettingsModel } from "@schema/UserSettings";
import { AiChatModel } from "@schema/ai/AiChatSchema";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { AddressBlacklistModel } from "~/shared/schema/shields/AddressBlacklistSchema";
import { DomainWhitelistModel } from "~/shared/schema/shields/DomainWhitelistSchema";
import { CountryBlacklistModel } from "~/shared/schema/shields/CountryBlacklistSchema";
import { BotTrafficOptionModel } from "~/shared/schema/shields/BotTrafficOptionSchema";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import { EventModel } from "~/shared/schema/metrics/EventSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');

    const { project_id } = ctx;

    const projectDeletation = await ProjectModel.deleteOne({ _id: project_id });
    const userSettingsDeletation = await UserSettingsModel.deleteOne({ project_id });
    
    const countDeletation = ProjectCountModel.deleteMany({ project_id });

    const sessionsDeletation = SessionModel.deleteMany({ project_id });
    const visitsDeletation = VisitModel.deleteMany({ project_id });
    const eventsDeletation = EventModel.deleteMany({ project_id });

    const aiChatsDeletation = AiChatModel.deleteMany({ project_id });

    //Shields
    const addressBlacklistDeletation = AddressBlacklistModel.deleteMany({ project_id });
    const botTrafficOptionsDeletation = BotTrafficOptionModel.deleteMany({ project_id });
    const countryBlacklistDeletation = CountryBlacklistModel.deleteMany({ project_id });
    const domainWhitelistDeletation = DomainWhitelistModel.deleteMany({ project_id });


    return { ok: true };


});