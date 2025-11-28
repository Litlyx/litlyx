import { model, Schema, Types } from 'mongoose';

export type TRegister = {
    email: string,
    password: string,
    code: string,
    created_at: Date
}

const RegisterSchema = new Schema<TRegister>({
    email: { type: String },
    password: { type: String },
    code: { type: String },
    created_at: { type: Date, default: () => Date.now() }
});

export const RegisterModel = model<TRegister>('registers', RegisterSchema);

