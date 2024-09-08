import { model, Schema, Types } from 'mongoose';

export type TApiSettings = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    apiKey: string,
    apiName: string,
    usage: number,
    created_at: Date
}

const ApiSettingsSchema = new Schema<TApiSettings>({
    project_id: { type: Types.ObjectId, index: 1 },
    apiKey: { type: String, required: true },
    apiName: { type: String, required: true },
    usage: { type: Number, default: 0, required: true, },
    created_at: { type: Date, default: () => Date.now() },
});

export const ApiSettingsModel = model<TApiSettings>('api_settings', ApiSettingsSchema);
