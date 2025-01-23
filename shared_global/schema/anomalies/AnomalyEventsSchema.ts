import { model, Schema, Types } from 'mongoose';


export type TAnomalyEvents = {
    project_id: Schema.Types.ObjectId
    eventDate: Date,
    created_at: Date
}

const AnomalyEventsSchema = new Schema<TAnomalyEvents>({
    project_id: { type: Types.ObjectId, required: true },
    eventDate: { type: Date, required: true },
    created_at: { type: Date, required: true },
})

export const AnomalyEventsModel = model<TAnomalyEvents>('anomaly_events', AnomalyEventsSchema);
