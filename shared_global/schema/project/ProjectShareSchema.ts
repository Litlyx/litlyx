import { model, Schema, Types } from 'mongoose';

export type TProjectShare = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    domain: string,
    link: string,
    password: string,
    description: string
}

const ProjectShareSchema = new Schema<TProjectShare>({
    project_id: { type: Types.ObjectId, index: true },
    domain: { type: String, required: true },
    link: { type: String, required: true },
    password: { type: String },
    description: { type: String }
});

export const ProjectShareModel = model<TProjectShare>('project_shares', ProjectShareSchema);