import { model, Schema, Types } from 'mongoose';


export type TAnomalyEvents = {
    project_id: Schema.Types.ObjectId
    eventDate: string,
    created_at: Date
}

const AnomalyEventsSchema = new Schema<TAnomalyEvents>({
    project_id: { type: Types.ObjectId, required: true },
    eventDate: { type: String, required: true },
    created_at: { type: Date, required: true },
})

export const AnomalyEventsModel = model<TAnomalyEvents>('anomaly_events', AnomalyEventsSchema);
