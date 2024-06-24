
import { Slice } from "@services/DateService";
import DateService from "@services/DateService";
import type mongoose from "mongoose";


export type TimelineAggregationOptions = {
    projectId: mongoose.Schema.Types.ObjectId,
    model: mongoose.Model<any>,
    from: string | number,
    to: string | number,
    slice: Slice,
    debug?: boolean
}

export type AdvancedTimelineAggregationOptions = TimelineAggregationOptions & {
    customMatch?: Record<string, any>,
    customGroup?: Record<string, any>,
    customProjection?: Record<string, any>
}

export async function executeAdvancedTimelineAggregation(options: AdvancedTimelineAggregationOptions) {

    options.customMatch = options.customMatch || {};
    options.customGroup = options.customGroup || {};
    options.customProjection = options.customProjection || {};

    const { group, sort, fromParts } = DateService.getQueryDateRange(options.slice);

    const aggregation = [
        {
            $match: {
                project_id: options.projectId,
                created_at: { $gte: new Date(options.from), $lte: new Date(options.to) },
                ...options.customMatch
            }
        },
        { $group: { _id: group, count: { $sum: 1 }, ...options.customGroup } },
        { $sort: sort },
        { $project: { _id: { $dateFromParts: fromParts }, count: "$count", ...options.customProjection } }
    ]

    if (options.debug === true) {
        console.log(JSON.stringify(aggregation, null, 2));
    }

    const timeline: { _id: string, count: number }[] = await options.model.aggregate(aggregation);

    return timeline;

}

export async function executeTimelineAggregation(options: TimelineAggregationOptions) {
    return executeAdvancedTimelineAggregation(options);
}


export function fillAndMergeTimelineAggregation(timeline: { _id: string, count: number }[], slice: Slice) {
    const filledDates = DateService.fillDates(timeline.map(e => e._id), slice);
    const merged = DateService.mergeFilledDates(filledDates, timeline, '_id', slice, { count: 0 });
    return merged;
}