import { model, Schema, Types } from 'mongoose';

export type TUserSettings = {
    user_id: Schema.Types.ObjectId,
    max_projects: number,
    active_project_id: Schema.Types.ObjectId
}

const UserSettingsSchema = new Schema<TUserSettings>({
    user_id: { type: Types.ObjectId, unique: true, index: 1 },
    max_projects: { type: Number, default: 3 },
    active_project_id: Schema.Types.ObjectId,
});

export const UserSettingsModel = model<TUserSettings>('user_settings', UserSettingsSchema);

