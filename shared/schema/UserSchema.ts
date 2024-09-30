import { model, Schema, Types } from 'mongoose';

export type TUser = {
    email: string,
    name: string,
    given_name: string,
    locale: string,
    picture: string,
    created_at: Date,
    google_tokens?: {
        refresh_token?: string;
        expiry_date?: number;
        access_token?: string;
        token_type?: string;
        id_token?: string;
        scope?: string;
    }
}

const UserSchema = new Schema<TUser>({
    email: { type: String, unique: true, index: 1 },
    name: String,
    given_name: String,
    locale: String,
    picture: String,
    google_tokens: {
        refresh_token: String,
        expiry_date: Number,
        access_token: String,
        token_type: String,
        id_token: String,
        scope: String
    },
    created_at: { type: Date, default: () => Date.now() }
})

export const UserModel = model<TUser>('users', UserSchema);

