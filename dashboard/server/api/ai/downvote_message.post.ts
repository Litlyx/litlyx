
import { Types } from "mongoose";
import { AiNewChatModel } from "~/shared/schema/ai/AiNewChatSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');
    const { project_id } = ctx;

    const { chat_id, message_index } = getQuery(event);

    if (!chat_id) throw createError({ status: 400, message: 'chat_id is required' });
    if (!message_index) throw createError({ status: 400, message: 'message_index is required' });
    const index = parseInt(message_index as string);
    if (isNaN(index)) throw createError({ status: 400, message: 'message_index must be a number' });

    const update = await AiNewChatModel.updateOne({ _id: new Types.ObjectId(chat_id as string), project_id }, { $set: { [`messages.${index}.downvoted`]: true } });

    return update;

});