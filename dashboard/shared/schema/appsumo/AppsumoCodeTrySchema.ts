import { model, Schema, Types } from 'mongoose';

export type TAppsumoCodeTry = {
    project_id: Types.ObjectId,
    codes: string[],
    valid_codes: string[],
}

const AppsumoCodeTrySchema = new Schema<TAppsumoCodeTry>({
    project_id: { type: Schema.Types.ObjectId, required: true, unique: true, index: 1 },
    codes: [{ type: String }],
    valid_codes: [{ type: String }]
});

export const AppsumoCodeTryModel = model<TAppsumoCodeTry>('appsumo_codes_tries', AppsumoCodeTrySchema);
