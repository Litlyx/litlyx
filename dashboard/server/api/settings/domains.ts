
import { VisitModel } from "@schema/metrics/VisitSchema";
import { getRequestDataOld } from "~/server/utils/getRequestData";

export default defineEventHandler(async event => {

    const data = await getRequestDataOld(event, { requireSchema: false });
    if (!data) return;

    const { project_id } = data;

    const result = await VisitModel.aggregate([
        { $match: { project_id } },
        { $group: { _id: "$website", count: { $sum: 1 } } },
    ]);

    return result as { _id: string, count: number }[];
});