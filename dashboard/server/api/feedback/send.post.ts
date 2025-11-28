import { FeedbackModel } from "~/shared/schema/FeedbackSchema";

export default defineEventHandler(async event => {

    if (isSelfhosted()) return;

    const ctx = await getRequestContext(event, 'pid');
    const { project_id, user_id } = ctx;

    const { text } = await readBody(event);

    if (!text || typeof text != 'string' || text.length == 0) {
        throw createError({ status: 400, message: 'Something went wrong.' })
    }

    await FeedbackModel.create({ project_id, user_id, text })

});