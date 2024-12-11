import { model, Schema } from 'mongoose';

export type TAiChatSchema = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    messages: any[],
    status: string,
    completed: boolean,
    title: string,
    created_at: Date,
    updated_at: Date
}

const AiChatSchema = new Schema<TAiChatSchema>({
    project_id: { type: Schema.Types.ObjectId, index: 1 },
    status: { type: String },
    completed: { type: Boolean },
    messages: [{ _id: false, type: Schema.Types.Mixed }],
    title: { type: String, required: true },
    created_at: { type: Date, default: () => Date.now() },
    updated_at: { type: Date, default: () => Date.now() },
});

export const AiChatModel = model<TAiChatSchema>('ai_chats', AiChatSchema);