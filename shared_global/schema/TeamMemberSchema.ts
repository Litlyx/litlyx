import { model, Schema, Types } from 'mongoose';

export type TeamMemberRole = 'ADMIN' | 'GUEST';


export type TPermission = {
    webAnalytics: boolean,
    events: boolean,
    ai: boolean,
    domains: string[],
}

export type TTeamMember = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    user_id?: Schema.Types.ObjectId,
    email?: string,
    role: TeamMemberRole,
    permission: TPermission,
    pending: boolean,
    created_at: Date,
}

const TeamMemberSchema = new Schema<TTeamMember>({
    project_id: { type: Types.ObjectId, index: true },
    user_id: { type: Types.ObjectId, index: true },
    email: { type: String, index: true },
    role: { type: String, required: true },
    permission: { type: Schema.Types.Mixed },
    pending: { type: Boolean, required: true },
    created_at: { type: Date, required: true, default: () => Date.now() },
});

export const TeamMemberModel = model<TTeamMember>('team_members', TeamMemberSchema);