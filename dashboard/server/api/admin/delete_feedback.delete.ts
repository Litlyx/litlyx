
import { FeedbackModel } from '@schema/FeedbackSchema';

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const { id } = await readBody(event);

    await FeedbackModel.deleteOne({ _id: id });


});