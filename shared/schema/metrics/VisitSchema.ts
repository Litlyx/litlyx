import { model, Schema } from 'mongoose';

export type TVisit = {
    project_id: Schema.Types.ObjectId,

    browser: string,
    os: string,

    continent: string,
    country: string,

    session: string,
    flowHash: string,
    device: string,

    website: string,
    page: string,
    referrer: string,

    created_at: Date
}

const VisitSchema = new Schema<TVisit>({
    project_id: { type: Schema.Types.ObjectId, index: 1 },

    browser: { type: String, required: true },
    os: { type: String, required: true },

    continent: { type: String },
    country: { type: String },

    session: { type: String },
    flowHash: { type: String },
    device: { type: String },

    website: { type: String, required: true },
    page: { type: String, required: true },
    referrer: { type: String, required: true },
    created_at: { type: Date, default: () => Date.now() },
})

export const VisitModel = model<TVisit>('visits', VisitSchema);

