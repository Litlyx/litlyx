import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { AiChatModel } from "@schema/ai/AiChatSchema";


export default defineEventHandler(async event => {

    const data = await getRequestData(event);
    if (!data) return;

    const { project_id } = data;

    const chatList = await AiChatModel.find({ project_id, deleted: false }, { _id: 1, title: 1 }, { sort: { updated_at: 1 } });

    return chatList.map(e => e.toJSON());

});