import { model, Schema, Types } from 'mongoose';
import { TPermission } from '../TeamMemberSchema';

export type TProjectLink = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    link_id: string,
    password: string,
    permission: TPermission
}

const ProjectLinkSchema = new Schema<TProjectLink>({
    project_id: { type: Types.ObjectId, index: true, unique: true },
    link_id: { type: String, required: true },
    password: { type: String },
    permission: { type: Schema.Types.Mixed },
});

export const ProjectLinkModel = model<TProjectLink>('project_links', ProjectLinkSchema);