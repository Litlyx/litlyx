import { model, Schema } from 'mongoose';

export type TAggDuration = {
    project_id: Schema.Types.ObjectId,
    domain: string,
    from: Date,
    to: Date,
    data: { _id: { date: Date }, count: number, timestamp: number }[]
}

const AggDurationSchema = new Schema<TAggDuration>({
    project_id: { type: Schema.Types.ObjectId, index: true },
    domain: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    data: [{ type: Schema.Types.Mixed }]
});

export const AggDurationModel = model<TAggDuration>('agg_durations', AggDurationSchema);

