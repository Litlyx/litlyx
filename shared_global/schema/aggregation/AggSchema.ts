import { model, Schema } from 'mongoose';

export type TAgg = {
    project_id: Schema.Types.ObjectId,
    domain: string,
    data_type: string,
    date: Date,
    data: number
}

const AggSchema = new Schema<TAgg>({
    project_id: { type: Schema.Types.ObjectId, index: true },
    data_type: { type: String, index: true, required: true },
    domain: { type: String, required: true },
    date: { type: Date, required: true },
    data: { type: Number, required: true }
});

AggSchema.index(
    { project_id: 1, date: 1, domain: 1, data_type: 1 },
    { unique: true }
);

export const AggModel = model<TAgg>('aggregations', AggSchema);

