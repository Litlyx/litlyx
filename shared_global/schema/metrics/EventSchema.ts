import { model, Schema, Types } from 'mongoose';

export type TEvent = {
    project_id: Schema.Types.ObjectId,
    name: string,
    metadata: Record<string, string>,
    session: string,
    flowHash: string,
    website: string,
    created_at: Date
}

const EventSchema = new Schema<TEvent>({
    project_id: { type: Types.ObjectId, index: 1 },
    name: { type: String, required: true, index: 1 },
    metadata: Schema.Types.Mixed,
    session: { type: String, index: 1 },
    flowHash: { type: String },
    website: { type: String, index: 1 },
    created_at: { type: Date, default: () => Date.now(), index: true },
})

export const EventModel = model<TEvent>('events', EventSchema);

