import { model, Schema, Types } from 'mongoose';

export type TProjectCount = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    events: number,
    visits: number,
}

const ProjectCountSchema = new Schema<TProjectCount>({
    project_id: { type: Types.ObjectId, index: true, unique: true },
    events: { type: Number, required: true, default: 0 },
    visits: { type: Number, required: true, default: 0 },
});

export const ProjectCountModel = model<TProjectCount>('project_counts', ProjectCountSchema);