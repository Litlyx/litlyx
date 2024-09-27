import { model, Schema, Types } from 'mongoose';

export type TIntegrationsCredentials = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    supabase_url: string,
    supabase_anon_key: string,
    supabase_service_role_key: string,
}

const IntegrationsCredentialsSchema = new Schema<TIntegrationsCredentials>({
    project_id: { type: Types.ObjectId, index: 1 },
    supabase_url: { type: String },
    supabase_anon_key: { type: String },
    supabase_service_role_key: { type: String },
});

export const IntegrationsCredentialsModel = model<TIntegrationsCredentials>('integrations_credentials', IntegrationsCredentialsSchema);
