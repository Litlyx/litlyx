import { model, Schema, Types } from 'mongoose';

export type TPremium = {
    user_id: Schema.Types.ObjectId,
    premium_type: number,
    customer_id: string,
    subscription_id: string,
    expire_at: number,
    created_at: Date,
}

const PremiumSchema = new Schema<TPremium>({
    user_id: { type: Types.ObjectId, unique: true, index: 1 },
    customer_id: { type: String },
    premium_type: { type: Number },
    subscription_id: { type: String },
    expire_at: { type: Number },
    created_at: { type: Date, default: () => Date.now() }
})

export const PremiumModel = model<TPremium>('premiums', PremiumSchema);

