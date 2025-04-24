


import { model, Schema, Types } from 'mongoose';

export type TReportCustomization = {
    _id: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    bg: string,
    text: string,
    logo: string
}

const ReportCustomizationSchema = new Schema<TReportCustomization>({
    project_id: { type: Types.ObjectId, index: 1 },
    bg: { type: String, required: true },
    text: { type: String, required: true },
    logo: { type: String, required: true },
});

export const ReportCustomizationModel = model<TReportCustomization>('repo_customizations', ReportCustomizationSchema);
