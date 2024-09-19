import DateService, { Slice } from '@services/DateService';
import { Model, Types } from "mongoose";


export async function getAggregation(model: Model<any>, pid: Types.ObjectId, from: number, to: number, slice: Slice) {

    const { group, sort, fromParts } = DateService.getQueryDateRange(slice);

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
    ]);

    return result;

}

