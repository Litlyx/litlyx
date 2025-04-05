import { ProjectModel } from "@schema/project/ProjectSchema";
import { ProjectCountModel } from "@schema/project/ProjectsCounts";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { LimitNotifyModel } from "@schema/broker/LimitNotifySchema";
import { AiChatModel } from "@schema/ai/AiChatSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], []);
    if (!data) return;

    const { project, user, project_id } = data;

    const projects = await ProjectModel.countDocuments({ owner: user.id });
    if (projects == 1) return setResponseStatus(event, 400, 'Cannot delete last project');


    const projectDeletation = ProjectModel.deleteOne({ _id: project_id });
    const countDeletation = ProjectCountModel.deleteMany({ project_id });
    const sessionsDeletation = SessionModel.deleteMany({ project_id });
    const notifiesDeletation = LimitNotifyModel.deleteMany({ project_id });
    const aiChatsDeletation = AiChatModel.deleteMany({ project_id });

    const results = await Promise.all([
        projectDeletation,
        countDeletation,
        sessionsDeletation,
        notifiesDeletation,
        aiChatsDeletation
    ])

    return { data: results };

});