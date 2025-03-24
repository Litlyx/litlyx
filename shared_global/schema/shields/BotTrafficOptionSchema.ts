import { model, Schema, Types } from 'mongoose';

export type TBotTrafficOptionSchema = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    block: boolean,
    created_at: Date
}

const BotTrafficOptionSchema = new Schema<TBotTrafficOptionSchema>({
    project_id: { type: Types.ObjectId, index: 1 },
    block: { type: Boolean, required: true },
    created_at: { type: Date, default: () => Date.now() },
});

export const BotTrafficOptionModel = model<TBotTrafficOptionSchema>('bot_traffic_options', BotTrafficOptionSchema);
