import { model, Schema, Types } from 'mongoose';

export type TEmailNotify = {
    _id: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId,
    n1: boolean,
    n2: boolean,
    n3: boolean,
    n4: boolean,
    n5: boolean,
    n6: boolean,
    n7: boolean,
    n8: boolean
}

const EmailNotifySchema = new Schema<TEmailNotify>({
    user_id: { type: Types.ObjectId, index: 1 },
    n1: { type: Boolean },
    n2: { type: Boolean },
    n3: { type: Boolean },
    n4: { type: Boolean },
    n5: { type: Boolean },
    n6: { type: Boolean },
    n7: { type: Boolean },
    n8: { type: Boolean },
});

export const EmailNotifyModel = model<TEmailNotify>('email_notifies', EmailNotifySchema);