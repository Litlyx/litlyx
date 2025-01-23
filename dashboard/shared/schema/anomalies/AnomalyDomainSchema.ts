import { model, Schema, Types } from 'mongoose';


export type TAnomalyDomain = {
    project_id: Schema.Types.ObjectId
    domain: string,
    created_at: Date
}

const AnomalyDomainSchema = new Schema<TAnomalyDomain>({
    project_id: { type: Types.ObjectId, required: true },
    domain: { type: String, required: true },
    created_at: { type: Date, required: true },
})

export const AnomalyDomainModel = model<TAnomalyDomain>('anomaly_domains', AnomalyDomainSchema);
