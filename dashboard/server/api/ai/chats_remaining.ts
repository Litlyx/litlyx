import { ProjectLimitModel } from "@schema/project/ProjectsLimits";

export async function getAiChatRemainings(project_id: string) {
    const limits = await ProjectLimitModel.findOne({ project_id })
    if (!limits) return 0;
    const chatsRemaining = limits.ai_limit - limits.ai_messages;

    if (isNaN(chatsRemaining)) return 0;
    return chatsRemaining;
}

export default defineEventHandler(async event => {
    const data = await getRequestData(event, [], ['AI']);
    if (!data) return;

    const { pid } = data;

    const chatsRemaining = await getAiChatRemainings(pid);
    return chatsRemaining;
});