import { ProjectLimitModel } from "@schema/ProjectsLimits";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";

export async function getAiChatRemainings(project_id: string) {
    const limits = await ProjectLimitModel.findOne({ _id: project_id })
    if (!limits) return 0;
    const chatsRemaining = limits.ai_limit - limits.ai_messages;
    if (isNaN(chatsRemaining)) return 0;
    return chatsRemaining;
}

export default defineEventHandler(async event => {
    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const chatsRemaining = await getAiChatRemainings(project_id);
    return chatsRemaining;
});