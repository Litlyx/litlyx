import { model, Schema, Types } from 'mongoose';

export type TEvent = {
    project_id: Schema.Types.ObjectId,
    name: string,
    metadata: Record<string, string>,
    session: string,
    flowHash: string,
    created_at: Date
}

const EventSchema = new Schema<TEvent>({
    project_id: { type: Types.ObjectId, index: 1 },
    name: { type: String, required: true },
    metadata: Schema.Types.Mixed,
    session: { type: String },
    flowHash: { type: String },
    created_at: { type: Date, default: () => Date.now() },
})

export const EventModel = model<TEvent>('events', EventSchema);

