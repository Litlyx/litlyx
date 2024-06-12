import { model, Schema } from 'mongoose';

export type TCustomPremiumPrice = {
    tag: string,
    price_id: number,
    count_limit: number,
    ai_message_limit: number,
    price: string,
    price_test?: string
}

const CustomPremiumPriceSchema = new Schema<TCustomPremiumPrice>({
    tag: { type: String, required: true },
    price_id: { type: Number, required: true },
    count_limit: { type: Number, required: true },
    ai_message_limit: { type: Number, required: true },
    price: { type: String, required: true },
    price_test: { type: String },
})

export const CustomPremiumPriceModel = model<TCustomPremiumPrice>('custom_premium_prices', CustomPremiumPriceSchema);
