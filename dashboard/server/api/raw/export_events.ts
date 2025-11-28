import { EventModel } from "~/shared/schema/metrics/EventSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'domain', 'permission:webAnalytics');
    const { project_id, domain } = ctx;

    const websiteMatch = domain ? { website: domain } : {};

    const visits = await EventModel.find({ project_id, ...websiteMatch });

    const csvHeader = [
        "name",
        "session",
        "metadata",
        "website",
        "created_at",
    ];


    const lines: any[] = [];
    visits.forEach(line => lines.push(line.toJSON()));

    const result = csvHeader.join(',') + '\n' + lines.map(element => {
        const content: string[] = [];
        for (const key of csvHeader) {
            content.push(key === 'metadata' ? JSON.stringify(element[key]) : element[key]);
        }
        return content.join(',');
    }).join('\n');


    return result;

});