import { model, Schema, Types } from 'mongoose';

export type TOnboarding = {
    user_id: Types.ObjectId,
    analytics: string,
    job: string
}

const OnboardingSchema = new Schema<TOnboarding>({
    user_id: { type: Schema.Types.ObjectId, required: true },
    analytics: { type: String, required: false },
    job: { type: String, required: false },
});

export const OnboardingModel = model<TOnboarding>('onboardings', OnboardingSchema);

