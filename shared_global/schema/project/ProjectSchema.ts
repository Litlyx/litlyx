import { model, Schema, Types } from 'mongoose';

export type TProject = {
    _id: Schema.Types.ObjectId,
    owner: Schema.Types.ObjectId,
    name: string,
    created_at: Date
}

const ProjectSchema = new Schema<TProject>({
    owner: { type: Types.ObjectId, index: 1 },
    name: { type: String, required: true },
    created_at: { type: Date, default: () => Date.now() },
})

export const ProjectModel = model<TProject>('projects', ProjectSchema);
