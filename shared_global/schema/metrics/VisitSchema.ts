import { model, Schema } from 'mongoose';

export type TVisit = {
    project_id: Schema.Types.ObjectId,

    browser: string,
    os: string,

    continent: string,
    country: string,
    region: string,
    city: string,

    session: string,
    flowHash: string,
    device: string,

    utm_medium: string,
    utm_source: string,
    utm_term: string,
    utm_campaign: string,
    utm_content: string,


    website: string,
    page: string,
    referrer: string,

    created_at: Date
}

const VisitSchema = new Schema<TVisit>({
    project_id: { type: Schema.Types.ObjectId, index: true },

    browser: { type: String, required: true },
    os: { type: String, required: true },

    continent: { type: String },
    country: { type: String },
    region: { type: String },
    city: { type: String },

    session: { type: String },
    flowHash: { type: String, index: true },
    device: { type: String },

    utm_medium: { type: String },
    utm_source: { type: String },
    utm_term: { type: String },
    utm_campaign: { type: String },
    utm_content: { type: String },

    website: { type: String, required: true },
    page: { type: String, required: true },
    referrer: { type: String, required: true },
    created_at: { type: Date, default: () => Date.now() },
})

VisitSchema.index({ project_id: 1, created_at: -1 });
VisitSchema.index({ _id: 1, project_id: 1 });
VisitSchema.index({ project_id: 1, website: 1 });
VisitSchema.index({ project_id: 1, session: 1, created_at: 1, });

export const VisitModel = model<TVisit>('visits', VisitSchema);

