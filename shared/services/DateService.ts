
import dayjs from 'dayjs';

export type Slice = keyof typeof slicesData;

const slicesData = {
    hour: {
        fromOffset: 1000 * 60 * 60 * 24
    },
    day: {
        fromOffset: 1000 * 60 * 60 * 24 * 7
    },
    month: {
        fromOffset: 1000 * 60 * 60 * 24 * 30 * 12
    },
    year: {
        fromOffset: 1000 * 60 * 60 * 24 * 30 * 12 * 10
    }
}


class DateService {

    public slicesData = slicesData;

    getDefaultRange(slice: Slice, from?: string, to?: string) {

    }

    getQueryDateRange(slice: Slice) {

        const group: Record<string, any> = {}
        const sort: Record<string, any> = {}
        const fromParts: Record<string, any> = {}

        switch (slice) {
            case 'hour':
                group.hour = { $hour: '$created_at' }
                sort['_id.hour'] = 1;
                fromParts.hour = "$_id.hour";
            case 'day':
                group.day = { $dayOfMonth: '$created_at' }
                sort['_id.day'] = 1;
                fromParts.day = "$_id.day";
            case 'month':
                group.month = { $month: '$created_at' }
                sort['_id.month'] = 1;
                fromParts.month = "$_id.month";
            case 'year':
                group.year = { $year: '$created_at' }
                sort['_id.year'] = 1;
                fromParts.year = "$_id.year";
        }

        return { group, sort, fromParts }
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

    fillDates(dates: string[], slice: Slice) {
        const allDates: dayjs.Dayjs[] = [];
        const firstDate = dayjs(dates.at(0));
        const lastDate = dayjs(dates.at(-1));
        let currentDate = firstDate.clone();
        while (currentDate.isBefore(lastDate)) {
            currentDate = currentDate.add(1, slice);
            allDates.push(currentDate);
        }
        return allDates;
    }

    mergeFilledDates<T extends Record<string, any>, K extends keyof T>(dates: dayjs.Dayjs[], items: T[], dateField: K, slice: Slice, fillData: Omit<T, K>) {
        const result = new Array<T>();
        for (const date of dates) {
            const item = items.find(e => dayjs(e[dateField]).isSame(date), slice);
            result.push(item ?? { ...fillData, [dateField]: date.format() } as T);
        }
        return result;
    }

}

const dateServiceInstance = new DateService();
export default dateServiceInstance;