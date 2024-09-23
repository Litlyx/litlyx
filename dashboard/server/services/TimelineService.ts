
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
    customProjection?: Record<string, any>,
    customIdGroup?: Record<string, any>
}

export async function executeAdvancedTimelineAggregation<T = {}>(options: AdvancedTimelineAggregationOptions) {

    options.customMatch = options.customMatch || {};
    options.customGroup = options.customGroup || {};
    options.customProjection = options.customProjection || {};
    options.customIdGroup = options.customIdGroup || {};

    const { group, sort, fromParts } = DateService.getQueryDateRange(options.slice);

    if (!sort) throw Error('Slice is probably not correct');

    const dateDistDays = (new Date(options.to).getTime() - new Date(options.from).getTime()) / (1000 * 60 * 60 * 24)
    // 15 Days
    if (options.slice === 'hour' && (dateDistDays > 15)) throw Error('Date gap too big for this slice');
    // 1 Year
    if (options.slice === 'day' && (dateDistDays > 365)) throw Error('Date gap too big for this slice');
    // 3 Years
    if (options.slice === 'month' && (dateDistDays > 365 * 3)) throw Error('Date gap too big for this slice');


    const aggregation = [
        {
            $match: {
                project_id: options.projectId,
                created_at: { $gte: new Date(options.from), $lte: new Date(options.to) },
                ...options.customMatch
            }
        },
        { $group: { _id: { ...group, ...options.customIdGroup }, count: { $sum: 1 }, ...options.customGroup } },
        { $sort: sort },
        { $project: { _id: { $dateFromParts: fromParts }, count: "$count", ...options.customProjection } }
    ]

    if (options.debug === true) {
        console.log(JSON.stringify(aggregation, null, 2));
    }

    const timeline: ({ _id: string, count: number } & T)[] = await options.model.aggregate(aggregation);

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

export function fillAndMergeTimelineAggregationV2(timeline: { _id: string, count: number }[], slice: Slice, from: string, to: string) {
    const filledDates = DateService.createBetweenDates(from, to, slice);
    const merged = DateService.mergeFilledDates(filledDates.dates, timeline, '_id', slice, { count: 0 });
    return merged;
}