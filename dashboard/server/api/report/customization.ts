
import { ReportCustomizationModel, TReportCustomization } from "~/shared/schema/report/ReportCustomizationSchema";

export default defineEventHandler(async event => {
    const data = await getRequestData(event, []);
    if (!data) return;

    const customization = await ReportCustomizationModel.findOne({ project_id: data.project_id });

    if (!customization) return {
        _id: '' as any,
        project_id: data.project_id.toString() as any,
        bg: 'black',
        logo: undefined,
        text: 'white'
    } as TReportCustomization;

    return customization.toJSON() as TReportCustomization;

});