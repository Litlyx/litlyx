import { model, Schema, Types } from 'mongoose';

export type TAppsumoCode = {
    _id: Schema.Types.ObjectId,
    code: string,
    used_at: Date,
    created_at?: Date,
}

const AppsumoCodeSchema = new Schema<TAppsumoCode>({
    code: { type: String, index: 1 },
    created_at: { type: Date, default: () => Date.now() },
    used_at: { type: Date, required: false },
});

export const AppsumoCodeModel = model<TAppsumoCode>('appsumo_codes', AppsumoCodeSchema);
