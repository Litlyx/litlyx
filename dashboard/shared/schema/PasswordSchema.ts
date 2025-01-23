import { model, Schema, Types } from 'mongoose';

export type TPassword = {
    email: string,
    password: string,
}

const PasswordSchema = new Schema<TPassword>({
    email: { type: String, index: true, unique: true },
    password: { type: String },
});

export const PasswordModel = model<TPassword>('passwords', PasswordSchema);

