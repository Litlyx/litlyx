import { model, Schema, Types } from 'mongoose';

export type TProjectCount = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    events: number,
    visits: number,
    sessions: number,
    lastRecheck?: Date
}

const ProjectCountSchema = new Schema<TProjectCount>({
    project_id: { type: Types.ObjectId, index: true, unique: true },
    events: { type: Number, required: true, default: 0 },
    visits: { type: Number, required: true, default: 0 },
    sessions: { type: Number, required: true, default: 0 },
    lastRecheck: { type: Date }
});

export const ProjectCountModel = model<TProjectCount>('project_counts', ProjectCountSchema);