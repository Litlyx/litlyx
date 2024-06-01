import { model, Schema, Types } from 'mongoose';

export type TUserSettings = {
    user_id: Schema.Types.ObjectId,
    active_project_id: Schema.Types.ObjectId
}

const UserSettingsSchema = new Schema<TUserSettings>({
    user_id: { type: Types.ObjectId, unique: true, index: 1 },
    active_project_id: Schema.Types.ObjectId,
});

export const UserSettingsModel = model<TUserSettings>('user_settings', UserSettingsSchema);

