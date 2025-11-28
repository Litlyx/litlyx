import { FeedbackModel, TFeedback } from "~/shared/schema/FeedbackSchema";

export type PopulatedFeedback = Omit<TFeedback, 'user_id'> & {
    user_id?: { email?: string };
}

export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'admin');

    const feedbacks = await FeedbackModel.find({}, {}, {
        populate: {
            path: 'user_id',
            model: 'users',
            select: 'email'
        },
        lean: true
    });

    return feedbacks as any as PopulatedFeedback[];

});