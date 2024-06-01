import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { ProjectCountModel } from "@schema/ProjectsCounts";

import { checkProjectCount } from '@functions/UtilsProjectCounts';

export async function getAiChatRemainings(project_id: string) {
    const counts = await checkProjectCount(project_id)
    if (!counts) return 0;
    const chatsRemaining = counts.ai_limit - counts.ai_messages;
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