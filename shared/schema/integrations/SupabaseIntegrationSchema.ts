import { model, Schema, Types } from 'mongoose';

export type TSupabaseIntegration = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    name: string,
    chart_type: string,
    table_name: string,
    xField: string,
    yMode: string,
    from: Date,
    to: Date,
    slice: string
}

const SupabaseIntegrationSchema = new Schema<TSupabaseIntegration>({
    project_id: { type: Types.ObjectId, index: 1 },
    name: { type: String, required: true },
    chart_type: { type: String, required: true },
    table_name: { type: String, required: true },
    xField: { type: String, required: true },
    yMode: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    slice: { type: String, required: true }
});

export const SupabaseIntegrationModel = model<TSupabaseIntegration>('supabase_integrations', SupabaseIntegrationSchema);
