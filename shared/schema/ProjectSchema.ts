import { model, Schema, Types } from 'mongoose';

export type TProject = {
    _id: Schema.Types.ObjectId,
    owner: Schema.Types.ObjectId,
    name: string,
    premium: boolean,
    premium_type?: number,
    customer_id?: string,
    premium_expire_at: Date,
    created_at: Date
}

const ProjectSchema = new Schema<TProject>({
    owner: { type: Types.ObjectId, index: 1 },
    name: { type: String, required: true },
    premium: { type: Boolean, default: false },
    premium_type: { type: Number },
    customer_id: { type: String },
    premium_expire_at: { type: Date },
    created_at: { type: Date, default: () => Date.now() },
})

export const ProjectModel = model<TProject>('projects', ProjectSchema);
