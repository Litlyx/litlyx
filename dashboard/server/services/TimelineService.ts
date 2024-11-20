
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

    const daysDiff = fns.differenceInDays(new Date(options.to), new Date(options.from));

    // 3 Days
    if (options.slice === 'hour' && (daysDiff > 3)) throw Error('Date gap too big for this slice');
    // 3 Weeks
    if (options.slice === 'day' && (daysDiff > 7 * 3)) throw Error('Date gap too big for this slice');
    // 3 Months
    if (options.slice === 'week' && (daysDiff > 30 * 3)) throw Error('Date gap too big for this slice');
    // 3 Years
    if (options.slice === 'month' && (daysDiff > 365 * 3)) throw Error('Date gap too big for this slice');


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
        { $sort: sort },
        {
            $project: {
                _id: "$firstDate",
                count: "$count",
                ...options.customProjection
            }
        }
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
    const allDates = generateDateSlices(slice, new Date(from), new Date(to));
    const merged = mergeDates(timeline, allDates, slice);
    return merged;
}

function generateDateSlices(slice: Slice, fromDate: Date, toDate: Date) {
    const slices: Date[] = [];
    let currentDate = fromDate;
    const addFunctions: { [key in Slice]: any } = { hour: fns.addHours, day: fns.addDays, week: fns.addWeeks, month: fns.addMonths, year: fns.addYears };
    const addFunction = addFunctions[slice];
    if (!addFunction) { throw new Error(`Invalid slice: ${slice}`); }
    while (fns.isBefore(currentDate, toDate) || currentDate.getTime() === toDate.getTime()) {
        slices.push(currentDate);
        currentDate = addFunction(currentDate, 1);
    }
    return slices;
}

function mergeDates(timeline: { _id: string, count: number }[], dates: Date[], slice: Slice) {

    const result: { _id: string, count: number }[] = [];

    const isSames: { [key in Slice]: any } = { hour: fns.isSameHour, day: fns.isSameDay, week: fns.isSameWeek, month: fns.isSameMonth, year: fns.isSameYear, }

    const isSame = isSames[slice];

    if (!isSame) {
        throw new Error(`Invalid slice: ${slice}`);
    }

    for (const element of timeline) {
        const elementDate = new Date(element._id);
        for (const date of dates) {
            if (isSame(elementDate, date)) {
                const existingEntry = result.find(item => isSame(new Date(item._id), date));

                if (existingEntry) {
                    existingEntry.count += element.count;
                } else {
                    result.push({
                        _id: date.toISOString(),
                        count: element.count,
                    });
                }
            }
        }
    }

    return result;
}
