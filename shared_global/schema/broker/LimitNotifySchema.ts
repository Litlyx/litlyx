import { model, Schema, Types } from 'mongoose';

export type TLimitNotify = {
    _id: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId,
    limit1: boolean,
    limit2: boolean,
    limit3: boolean
}

const LimitNotifySchema = new Schema<TLimitNotify>({
    user_id: { type: Types.ObjectId, index: 1 },
    limit1: { type: Boolean },
    limit2: { type: Boolean },
    limit3: { type: Boolean }
});

export const LimitNotifyModel = model<TLimitNotify>('limit_notifies', LimitNotifySchema);