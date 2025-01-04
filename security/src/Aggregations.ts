import DateService, { Slice } from '@services/DateService';
import { Model, Types } from "mongoose";


export async function getDayAggregation(model: Model<any>, pid: Types.ObjectId, from: number, to: number) {

    const sort = { created_at: 1 };
    const group = { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } };
    const fromParts = { year: { $year: "$created_at" }, month: { $month: "$created_at" }, day: { $dayOfMonth: "$created_at" } };

    const result = model.aggregate([
        {
            $match: {
                project_id: pid,
                created_at: { $gte: new Date(from), $lte: new Date(to) },
            }
        },
        { $group: { _id: group, count: { $sum: 1 } } },
        { $sort: sort },
        { $project: { _id: { $dateFromParts: fromParts }, count: "$count" } }
    ] as any);

    return result;

}

