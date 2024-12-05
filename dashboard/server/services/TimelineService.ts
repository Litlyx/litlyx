
import { Slice } from "@services/DateService";
import DateService from "@services/DateService";
import type mongoose from "mongoose";
import * as fns from 'date-fns'

export type TimelineAggregationOptions = {
    projectId: mongoose.Schema.Types.ObjectId | mongoose.Types.ObjectId,
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

    const { group, sort } = DateService.getQueryDateRange(options.slice);

    if (!sort) throw Error('Slice is probably not correct');


    const [sliceValid, errorOrDays] = checkSliceValidity(options.from, options.to, options.slice);

    if (!sliceValid) throw Error(errorOrDays);

    const aggregation = [
        {
            $match: {
                project_id: options.projectId,
                created_at: { $gte: new Date(options.from), $lte: new Date(options.to) },
                ...options.customMatch
            }
        },
        {
            $group: {
                _id: { ...group, ...options.customIdGroup },
                count: { $sum: 1 },
                firstDate: { $first: '$created_at' },
                ...options.customGroup
            }
        },
        { $sort: { firstDate: 1 } },
        {
            $project: {
                _id: "$firstDate",
                count: "$count",
                ...options.customProjection
            }
        }
    ] as any;

    if (options.debug === true) {
        console.log('---------- SORT ----------')
        console.log(JSON.stringify(sort, null, 2));
        console.log('---------- AGGREAGATION ----------')
        console.log(JSON.stringify(aggregation, null, 2));
    }

    const timeline: ({ _id: string, count: number } & T)[] = await options.model.aggregate(aggregation);

    return timeline;

}

export async function executeTimelineAggregation(options: TimelineAggregationOptions) {
    return executeAdvancedTimelineAggregation(options);
}

/**
 * @deprecated use fillAndMergeTimelineAggregationV2
 */
export function fillAndMergeTimelineAggregation(timeline: { _id: string, count: number }[], slice: Slice) {
    const filledDates = DateService.fillDates(timeline.map(e => e._id), slice);
    const merged = DateService.mergeFilledDates(filledDates, timeline, '_id', slice, { count: 0 });
    return merged;
}

export function fillAndMergeTimelineAggregationV2(timeline: { _id: string, count: number }[], slice: Slice, from: string, to: string) {
    const allDates = DateService.generateDateSlices(slice, new Date(from), new Date(to));
    const merged = DateService.mergeDates(timeline, allDates, slice);
    return merged;
}

export function checkSliceValidity(from: string | number | Date, to: string | number | Date, slice: Slice): [false, string] | [true, number] {
    return DateService.canUseSlice(from, to, slice);
}
