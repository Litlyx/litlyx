import { model, Schema, Types } from 'mongoose';


export type TSession = {
    project_id: Schema.Types.ObjectId,
    session: string,
    flowHash: string,
    duration: number,
    updated_at: Date,
    created_at: Date,
}

const SessionSchema = new Schema<TSession>({
    project_id: { type: Types.ObjectId, index: 1 },
    session: { type: String, required: true },
    flowHash: { type: String },
    duration: { type: Number, required: true, default: 0 },
    updated_at: { type: Date, default: () => Date.now() },
    created_at: { type: Date, default: () => Date.now(), index: true },
})

export const SessionModel = model<TSession>('sessions', SessionSchema);

