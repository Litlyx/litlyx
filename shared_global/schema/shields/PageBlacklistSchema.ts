import { model, Schema, Types } from 'mongoose';

export type TPageBlacklistSchema = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    page: string,
    description:string,
    created_at: Date
}

const CountryBlacklistSchema = new Schema<TPageBlacklistSchema>({
    project_id: { type: Types.ObjectId, index: 1 },
    page: { type: String, required: true },
    description: { type: String },
    created_at: { type: Date, default: () => Date.now() },
});

export const CountryBlacklistModel = model<TPageBlacklistSchema>('country_blacklists', CountryBlacklistSchema);
