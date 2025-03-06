
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
    timeOffset?: number,
    debug?: boolean,
    domain?: string
}

export type AdvancedTimelineAggregationOptions = TimelineAggregationOptions & {
    customMatch?: Record<string, any>,
    customGroup?: Record<string, any>,
    customProjection?: Record<string, any>,
    customIdGroup?: Record<string, any>,
    customAfterMatch?: Record<string, any>
}

export async function executeAdvancedTimelineAggregation<T = {}>(options: AdvancedTimelineAggregationOptions) {

    options.customMatch = options.customMatch || {};
    options.customGroup = options.customGroup || {};
    options.customProjection = options.customProjection || {};
    options.customIdGroup = options.customIdGroup || {};

    const { dateFromParts, granularity } = DateService.getGranularityData(options.slice, '$tmpDate');
    if (!dateFromParts) throw Error('Slice is probably not correct');

    const [sliceValid, errorOrDays] = checkSliceValidity(options.from, options.to, options.slice);
    if (!sliceValid) throw Error(errorOrDays);

    const timeOffset = options.timeOffset || 0;

    const domainMatch: any = {}
    if (options.domain) domainMatch.website = options.domain

    const aggregation = [
        {
            $match: {
                project_id: options.projectId,
                created_at: {
                    $gte: new Date(options.from),
                    $lte: new Date(options.to)
                },
                ...domainMatch,
                ...options.customMatch
            }
        },
        {
            $addFields: {
                tmpDate: {
                    $dateSubtract: {
                        startDate: "$created_at",
                        unit: "minute",
                        amount: timeOffset
                    }
                }
            }
        },
        {
            $addFields: { isoDate: { $dateFromParts: dateFromParts } }
        },
        {
            $group: {
                _id: { isoDate: "$isoDate", ...options.customIdGroup },
                count: { $sum: 1 },
                ...options.customGroup
            }
        },
        {
            $densify: {
                field: "_id.isoDate",
                range: {
                    step: 1,
                    unit: granularity,
                    bounds: 'full'
                    // [
                    //     new Date(new Date(options.from).getTime() - (timeOffset * 1000 * 60)),
                    //     new Date(new Date(options.to).getTime() - (timeOffset * 1000 * 60) + 1),
                    // ]
                }
            }
        },
        {
            $sort: { "_id.isoDate": 1 }
        },
        {
            $addFields: { count: { $ifNull: ["$count", 0] }, }
        },
        {
            $project: {
                _id: '$_id.isoDate',
                count: '$count',
                ...options.customProjection
            }
        }
    ] as any[];


    if (options.customAfterMatch) aggregation.splice(1, 0, options.customAfterMatch);


    if (options.debug === true) {
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
