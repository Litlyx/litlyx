
import { UserLimitModel } from "@schema/UserLimitSchema";

export async function getAiChatRemainings(user_id: string) {
    const limits = await UserLimitModel.findOne({ user_id })
    if (!limits) return 0;
    const chatsRemaining = limits.ai_limit - limits.ai_messages;
    if (isNaN(chatsRemaining)) return 0;
    return chatsRemaining;
}

export default defineEventHandler(async event => {
    const data = await getRequestData(event, [], ['AI']);
    if (!data) return;

    const { pid, user } = data;

    const chatsRemaining = await getAiChatRemainings(user.id);
    return chatsRemaining;
});