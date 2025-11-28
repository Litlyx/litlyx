import { model, Schema, Types } from 'mongoose';

export type TAddressBlacklistSchema = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    address: string,
    description: string,
    created_at: Date
}

const AddressBlacklistSchema = new Schema<TAddressBlacklistSchema>({
    project_id: { type: Types.ObjectId, index: 1 },
    address: { type: String, required: true },
    description: { type: String },
    created_at: { type: Date, default: () => Date.now() },
});

export const AddressBlacklistModel = model<TAddressBlacklistSchema>('address_blacklists', AddressBlacklistSchema);
