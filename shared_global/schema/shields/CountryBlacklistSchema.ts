import { model, Schema, Types } from 'mongoose';

export type TCountryBlacklistSchema = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    country: string,
    description: string,
    created_at: Date
}

const CountryBlacklistSchema = new Schema<TCountryBlacklistSchema>({
    project_id: { type: Types.ObjectId, index: 1 },
    country: { type: String, required: true },
    description: { type: String },
    created_at: { type: Date, default: () => Date.now() },
});

export const CountryBlacklistModel = model<TCountryBlacklistSchema>('country_blacklists', CountryBlacklistSchema);
