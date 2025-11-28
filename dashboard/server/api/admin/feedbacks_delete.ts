import { FeedbackModel, TFeedback } from "~/shared/schema/FeedbackSchema";

export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'admin');
    const { id } = getQuery(event);
    const deletation = await FeedbackModel.deleteOne({ _id: id });
    return deletation;
});