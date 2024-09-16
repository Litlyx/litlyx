import { model, Schema, Types } from 'mongoose';


export type TAnomalyVisit = {
    project_id: Schema.Types.ObjectId
    visitDate: Date,
    created_at: Date
}

const AnomalyVisitSchema = new Schema<TAnomalyVisit>({
    project_id: { type: Types.ObjectId, required: true },
    visitDate: { type: Date, required: true },
    created_at: { type: Date, required: true },
})

export const AnomalyVisitModel = model<TAnomalyVisit>('anomaly_visits', AnomalyVisitSchema);
