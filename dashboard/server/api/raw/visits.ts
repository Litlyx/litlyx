
import { VisitModel } from "@schema/metrics/VisitSchema";
import { parseNumberInt } from "~/utils/parseNumber";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'domain', 'range', 'permission:webAnalytics');
    const { project_id, domain, from, to } = ctx;

    const { page, limit } = getQuery(event);

    const pageValue = parseNumberInt(page, 1);
    const limitValue = parseNumberInt(limit, 10);
    const skipValue = (pageValue - 1) * limitValue;

    const websiteMatch = domain ? { website: domain } : {};


    const count = await VisitModel.countDocuments({ project_id, ...websiteMatch, created_at: { $gte: new Date(from), $lte: new Date(to) } });

    const result = await VisitModel.find({
        project_id, ...websiteMatch, created_at: { $gte: new Date(from), $lte: new Date(to) }
    }, {}, {
        skip: skipValue, limit: limitValue, sort: { created_at: -1 }
    })

    return { count, data: result };
});