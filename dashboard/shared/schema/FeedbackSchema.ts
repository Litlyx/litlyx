import { model, Schema, Types } from 'mongoose';

export type TFeedback = {
    user_id: Types.ObjectId,
    project_id: Types.ObjectId,
    text: string
}

const FeedbackSchema = new Schema<TFeedback>({
    user_id: { type: Schema.Types.ObjectId, required: true },
    project_id: { type: Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
});

export const FeedbackModel = model<TFeedback>('feedbacks', FeedbackSchema);

