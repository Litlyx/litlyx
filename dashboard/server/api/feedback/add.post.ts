
import { FeedbackModel } from '@schema/FeedbackSchema';

export default defineEventHandler(async event => {
    const data = await getRequestData(event);
    if (!data) return;

    const { text } = await readBody(event);

    const save = await FeedbackModel.create({
        user_id: data.user.id,
        project_id: data.project_id,
        text
    });

    return { ok: true }

});