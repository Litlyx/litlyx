
import { ProjectModel } from "@schema/ProjectSchema";
import { ProjectCountModel } from "@schema/ProjectsCounts";
import { ProjectLimitModel } from "@schema/ProjectsLimits";
import { UserSettingsModel } from "@schema/UserSettings";
import { AiChatModel } from "@schema/ai/AiChatSchema";
import { LimitNotifyModel } from "@schema/broker/LimitNotifySchema";
import { SessionModel } from "@schema/metrics/SessionSchema";
import StripeService from "~/server/services/StripeService";

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;

    const projects = await ProjectModel.find({ owner: userData.id });

    const premiumProjects = projects.filter(e => { return e.premium && e.premium_type != 0 }).length;
    if (premiumProjects > 0) return setResponseStatus(event, 400, 'Cannot delete an account with a premium project');

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

    }

    return { ok: true };


});