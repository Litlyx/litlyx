import { model, Schema, Types } from 'mongoose';

export type TUserLimit = {
    _id: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId,
    events: number,
    visits: number,
    ai_messages: number,
    limit: number,
    ai_limit: number,
    billing_expire_at: Date,
    billing_start_at: Date,
}

const UserLimitSchema = new Schema<TUserLimit>({
    user_id: { type: Types.ObjectId, index: true, unique: true },
    events: { type: Number, required: true, default: 0 },
    visits: { type: Number, required: true, default: 0 },
    ai_messages: { type: Number, required: true, default: 0 },
    limit: { type: Number, required: true },
    ai_limit: { type: Number, required: true },
    billing_start_at: { type: Date, required: true },
    billing_expire_at: { type: Date, required: true },
});

export const UserLimitModel = model<TUserLimit>('user_limits', UserLimitSchema);