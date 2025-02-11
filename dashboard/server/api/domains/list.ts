
import { VisitModel } from "@schema/metrics/VisitSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, ['GUEST']);
    if (!data) return;

    const { project_id } = data;

    const result = await VisitModel.aggregate([
        { $match: { project_id, } },
        { $group: { _id: "$website", visits: { $sum: 1 } } },
    ]);

    return result as { _id: string, visits: number }[];

});