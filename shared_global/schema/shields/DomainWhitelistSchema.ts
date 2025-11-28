import { model, Schema, Types } from 'mongoose';

export type TDomainWhitelistSchema = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    domains: string[],
    created_at: Date
}

const DomainWhitelistSchema = new Schema<TDomainWhitelistSchema>({
    project_id: { type: Types.ObjectId, index: 1 },
    domains: [{ type: String, required: true }],
    created_at: { type: Date, default: () => Date.now() },
});

export const DomainWhitelistModel = model<TDomainWhitelistSchema>('domain_whitelists', DomainWhitelistSchema);
