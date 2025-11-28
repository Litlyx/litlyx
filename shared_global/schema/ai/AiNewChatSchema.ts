import { model, Schema } from 'mongoose';

export type TAiNewChatSchema = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    messages: any[],
    status: string,
    title: string,
    deleted: boolean,
    created_at: Date,
    updated_at: Date
}

const AiNewChatSchema = new Schema<TAiNewChatSchema>({
    project_id: { type: Schema.Types.ObjectId, index: 1 },
    status: { type: String },
    messages: [{ _id: false, type: Schema.Types.Mixed }],
    title: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    created_at: { type: Date, default: () => Date.now() },
    updated_at: { type: Date, default: () => Date.now() },
});

export const AiNewChatModel = model<TAiNewChatSchema>('ai_new_chats', AiNewChatSchema);