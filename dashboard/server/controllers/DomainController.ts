import { endOfDay, startOfDay } from "date-fns";
import { Types } from "mongoose";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";


type DomainsListOptions = {
    project_id: string,
    date: Date
}

export async function getAllDomains(options: DomainsListOptions) {
    const domains = await VisitModel.aggregate([
        {
            $match: {
                project_id: new Types.ObjectId(options.project_id),
                created_at: { $gte: startOfDay(options.date), $lte: endOfDay(options.date) }
            },
        },
        { $group: { _id: "$website" } }
    ]);
    return domains.map(e => e._id) as string[];
}