import { model, Schema, Types } from 'mongoose';

export type TUser = {
    email: string,
    name: string,
    given_name: string,
    locale: string,
    picture: string,
    created_at: Date,
}

const UserSchema = new Schema<TUser>({
    email: { type: String, unique: true, index: 1 },
    name: String,
    given_name: String,
    locale: String,
    picture: String,    
    created_at: { type: Date, default: () => Date.now() }
})

export const UserModel = model<TUser>('users', UserSchema);

