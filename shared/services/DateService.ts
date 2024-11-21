
import dayjs from 'dayjs';
import * as fns from 'date-fns';

export type Slice = keyof typeof slicesData;

const slicesData = {
    hour: {},
    day: {},
    week: {},
    month: {},
    year: {}
}

const startOfFunctions: { [key in Slice]: (date: Date) => Date } = {
    hour: fns.startOfHour,
    day: fns.startOfDay,
    week: fns.startOfWeek,
    month: fns.startOfMonth,
    year: fns.startOfYear
};

const endOfFunctions: { [key in Slice]: (date: Date) => Date } = {
    hour: fns.endOfHour,
    day: fns.endOfDay,
    week: fns.endOfWeek,
    month: fns.endOfMonth,
    year: fns.endOfYear
};

class DateService {

    public slicesData = slicesData;

    getChartLabelFromISO(iso: string, locale: string, slice: Slice) {
        if (slice === 'hour') return fns.format(iso, 'HH:mm');
        if (slice === 'day') return fns.format(iso, 'dd/MM');
        if (slice === 'week') return fns.format(iso, 'dd/MM');
        if (slice === 'month') return fns.format(iso, 'MM MMMM');
        if (slice === 'year') return fns.format(iso, 'YYYY');
        return iso;
    }

    canUseSlice(from: string | number | Date, to: string | number | Date, slice: Slice) {
        const daysDiff = fns.differenceInDays(new Date(to), new Date(from));
        return this.canUseSliceFromDays(daysDiff, slice);
    }

    canUseSliceFromDays(days: number, slice: Slice): [false, string] | [true, number] {
        // 3 Days
        if (slice === 'hour' && (days > 3)) return [false, 'Date gap too big for this slice'];
        // 3 Weeks
        if (slice === 'day' && (days > 7 * 3)) return [false, 'Date gap too big for this slice'];
        // 3 Months
        if (slice === 'week' && (days > 30 * 3)) return [false, 'Date gap too big for this slice'];
        // 3 Years
        if (slice === 'month' && (days > 365 * 3)) return [false, 'Date gap too big for this slice'];
        return [true, days]
    }

    startOfSlice(date: Date, slice: Slice) {
        const fn = startOfFunctions[slice];
        if (!fn) throw Error(`startOfFunction of slice ${slice} not found`);
        return fn(date);
    }

    endOfSlice(date: Date, slice: Slice) {
        const fn = endOfFunctions[slice];
        if (!fn) throw Error(`endOfFunction of slice ${slice} not found`);
        return fn(date);
    }


    getQueryDateRange(slice: Slice) {

        const group: Record<string, any> = {}
        const sort: Record<string, any> = {}

        switch (slice) {
            case 'hour':
                group.hour = { $hour: '$created_at' }
            case 'day':
                group.day = { $dayOfMonth: '$created_at' }
            case 'week':
                group.week = { $isoWeek: '$created_at' }
            case 'month':
                group.month = { $month: '$created_at' }
            case 'year':
                group.year = { $year: '$created_at' }
        }

        switch (slice) {
            case 'year':
                sort['_id.year'] = 1;
                break;
            case 'month':
                sort['_id.year'] = 1;
                sort['_id.month'] = 1;
                break;
            case 'week':
            case 'day':
                sort['_id.year'] = 1;
                sort['_id.month'] = 1;
                sort['_id.day'] = 1;
                break;
            case 'hour':
                sort['_id.year'] = 1;
                sort['_id.month'] = 1;
                sort['_id.day'] = 1;
                sort['_id.hour'] = 1;
                break;
        }

        return { group, sort }
    }

    prepareDateRange(from: string, to: string, slice: Slice) {

        let fromDate = dayjs(from).minute(0).second(0).millisecond(0);
        let toDate = dayjs(to).minute(0).second(0).millisecond(0);

        switch (slice) {
            case 'day':
                fromDate = fromDate.hour(0);
                toDate = toDate.hour(0);
                break;
            case 'hour':
                break;
        }

        return {
            from: fromDate.toDate(),
            to: toDate.toDate()
        }
    }

    createBetweenDates(from: string, to: string, slice: Slice) {
        let start = dayjs(from);
        const end = dayjs(to);
        const filledDates: dayjs.Dayjs[] = [];
        while (start.isBefore(end) || start.isSame(end)) {
            filledDates.push(start);
            start = start.add(1, slice);
        }
        return { dates: filledDates, from, to };
    }

    fillDates(dates: string[], slice: Slice) {
        const allDates: dayjs.Dayjs[] = [];
        const firstDate = dayjs(dates.at(0));
        const lastDate = dayjs(dates.at(-1));
        let currentDate = firstDate.clone();

        allDates.push(currentDate);

        while (currentDate.isBefore(lastDate, slice)) {
            currentDate = currentDate.add(1, slice);
            allDates.push(currentDate);
        }

        return allDates;
    }

    mergeFilledDates<T extends Record<string, any>, K extends keyof T>(dates: dayjs.Dayjs[], items: T[], dateField: K, slice: Slice, fillData: Omit<T, K>) {
        const result = new Array<T>();
        for (const date of dates) {
            const item = items.find(e => dayjs(e[dateField]).isSame(date, slice));
            result.push(item ?? { ...fillData, [dateField]: date.format() } as T);
        }
        return result;
    }

}

const dateServiceInstance = new DateService();
export default dateServiceInstance;
