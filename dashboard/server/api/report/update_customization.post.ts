
import z from 'zod';
import { ReportCustomizationModel } from "~/shared/schema/report/ReportCustomizationSchema";

const ZUpdateCustomizationBody = z.object({
    logo: z.string().optional(),
    bg: z.enum(['black', 'white'])
})

export default defineEventHandler(async event => {
    const data = await getRequestData(event, []);
    if (!data) return;

    const body = await readBody(event);

    const bodyData = ZUpdateCustomizationBody.parse(body);

    await ReportCustomizationModel.updateOne({ project_id: data.project_id }, {
        logo: bodyData.logo,
        bg: bodyData.bg,
        text: bodyData.bg === 'white' ? 'black' : 'white'
    }, { upsert: true });

    return { ok: true }

});