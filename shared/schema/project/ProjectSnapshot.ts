import { model, Schema, Types } from 'mongoose';

export type TProjectSnapshot = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    name: string,
    from: Date,
    to: Date,
    color: string
}

const ProjectSnapshotSchema = new Schema<TProjectSnapshot>({
    project_id: { type: Types.ObjectId, index: true },
    name: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    color: { type: String, required: true },
});

export const ProjectSnapshotModel = model<TProjectSnapshot>('project_snapshots', ProjectSnapshotSchema);