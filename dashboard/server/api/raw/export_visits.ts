import { VisitModel } from "@schema/metrics/VisitSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'domain', 'permission:webAnalytics');
    const { project_id, domain } = ctx;


    const websiteMatch = domain ? { website: domain } : {};

    const visits = await VisitModel.find({ project_id, ...websiteMatch });

    const csvHeader = [
        "browser",
        "os",
        "continent",
        "country",
        "device",
        "website",
        "page",
        "referrer",
        "created_at",
    ];


    const lines: any[] = [];
    visits.forEach(line => lines.push(line.toJSON()));

    const result = csvHeader.join(',') + '\n' + lines.map(element => {
        const content: string[] = [];
        for (const key of csvHeader) {
            content.push(element[key]);
        }
        return content.join(',');
    }).join('\n');


    return result;

});