
import { Slice } from "@services/DateService";
import type mongoose from "mongoose";
import DateService from '@services/DateService';
import * as fns from 'date-fns'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

export type TimelineAggregationOptions = {
    projectId: mongoose.Schema.Types.ObjectId | mongoose.Types.ObjectId,
    model: mongoose.Model<any>,
    from: number,
    to: number,
    slice: Slice,
    debug?: boolean,
    explain?: boolean,
    domain?: string,
    allowDisk?: boolean,
    forced?: boolean
}

export type AdvancedTimelineAggregationOptions = TimelineAggregationOptions & {
    customMatch?: Record<string, any>,
    customGroup?: Record<string, any>,
    customProjection?: Record<string, any>,
    customIdGroup?: Record<string, any>,
    customAfterMatch?: Record<string, any>,
    customQueries?: { index: number, query: Record<string, any> }[]
}


export const granularityMap: Record<Slice, string> = {
    hour: 'hour',
    day: 'day',
    month: 'month',
    week: 'week',
    year: 'year'
}

export function checkSliceValidity(from: number, to: number, slice: Slice): [false, string] | [true, number] {
    const days = fns.differenceInDays(new Date(to), new Date(from));
    const [min, max] = DateService.sliceAvailabilityMap[slice];
    if (days < min) return [false, 'date gap too small for this slice'];
    if (days > max) return [false, 'date gap too big for this slice'];
    return [true, days];
}


export function prepareTimelineAggregation(options: TimelineAggregationOptions) {
    const granularity = granularityMap[options.slice];
    if (!granularity) throw createError({ status: 400, message: 'slice not correct' });

    if (!options.forced) {
        const [sliceValid, errorOrDays] = checkSliceValidity(options.from, options.to, options.slice);
        if (!sliceValid) throw createError({ status: 400, message: errorOrDays });
    }

    const domainMatch: any = {}
    if (options.domain) domainMatch.website = options.domain

    let from = new Date(options.from);
    let to = new Date(options.to);

    if (options.slice === 'month') {
        from = dayjs(from).utc().startOf('month').toDate()
        to = dayjs(to).utc().startOf('month').toDate()
    } else if (options.slice === 'hour') {
        // from = dayjs(from).utc().startOf('hour').toDate()
        // to = dayjs(to).utc().startOf('hour').toDate()
    } else if (options.slice === 'day') {
        from = dayjs(from).utc().startOf('day').toDate()
        to = dayjs(to).utc().startOf('day').toDate()
    }


    return { granularity, domainMatch, from, to }
}

export async function executeAdvancedTimelineAggregation<T = {}>(options: AdvancedTimelineAggregationOptions): Promise<any[]> {

    options.customMatch = options.customMatch || {};
    options.customGroup = options.customGroup || {};
    options.customProjection = options.customProjection || {};
    options.customIdGroup = options.customIdGroup || {};
    options.customQueries = options.customQueries || [];


    const { domainMatch, granularity, from, to } = prepareTimelineAggregation(options);

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
            $group: {
                _id: {
                    date: {
                        $dateTrunc: { date: "$created_at", unit: granularity, timezone: "UTC" }
                    },
                    ...options.customIdGroup
                },
                count: { $sum: 1 },
                ...options.customGroup
            }
        },
        {
            $densify: {
                field: "_id.date",
                range: {
                    step: 1,
                    unit: granularity,
                    bounds: [from, to]
                }
            }
        },
        // {
        //     $addFields: {
        //         timestamp: { $toLong: "$_id.date" }
        //     }
        // },
        // { $set: { count: { $ifNull: ["$count", 0] } } },
        // { $sort: { '_id.date': 1 } },
        // {
        //     $project: {
        //         _id: 1, count: 1, timestamp: 1, ...options.customProjection
        //     }
        // }
        {
            $project: {
                _id: "$_id.date",
                count: { $ifNull: ["$count", 0] },
                // timestamp: { $toLong: "$_id.date" },
                ...options.customProjection
            }
        }
    ] as any[];

    for (const customQuery of options.customQueries) {
        aggregation.splice(customQuery.index, 0, customQuery.query);
    }

    if (options.customAfterMatch) aggregation.splice(1, 0, options.customAfterMatch);

    if (options.debug === true || options.explain === true) {
        console.log('---------- AGGREAGATION ----------')
        console.log(getPrettyAggregation(aggregation, 2));
    }

    if (options.explain) {
        const explained: any = await options.model.aggregate(aggregation, { allowDiskUse: options.allowDisk ?? false }).explain('executionStats');
        return explained;
    }
    const timeline: ({ _id: { date: string }, count: number, timestamp: number } & T)[] = await options.model.aggregate(aggregation, {
        allowDiskUse: options.allowDisk ?? false
    })

    return timeline;

}

export async function executeTimelineAggregation(options: TimelineAggregationOptions) {
    return executeAdvancedTimelineAggregation(options);
}

// export function fillAndMergeTimelineAggregationV2(timeline: { _id: string, count: number }[], slice: Slice, from: string, to: string) {
//     const allDates = DateService.generateDateSlices(slice, new Date(from), new Date(to));
//     const merged = DateService.mergeDates(timeline, allDates, slice);
//     return merged;
// }

