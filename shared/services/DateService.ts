
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

    getChartLabelFromISO(iso: string, locale: string, slice: Slice) {
        const date = dayjs(iso).locale(locale);
        if (slice === 'hour') return date.format('HH:mm')
        if (slice === 'day') return date.format('DD/MM')
        return date.format();
    }

    getDefaultRange(slice: Slice) {
        return {
            from: new Date(Date.now() - slicesData[slice].fromOffset).toISOString(),
            to: new Date().toISOString()
        }
    }

    getQueryDateRange(slice: Slice) {

        const group: Record<string, any> = {}
        const sort: Record<string, any> = {}
        const fromParts: Record<string, any> = {}

        switch (slice) {
            case 'hour':
                group.hour = { $hour: '$created_at' }
                fromParts.hour = "$_id.hour";
            case 'day':
                group.day = { $dayOfMonth: '$created_at' }
                fromParts.day = "$_id.day";
            case 'month':
                group.month = { $month: '$created_at' }
                fromParts.month = "$_id.month";
            case 'year':
                group.year = { $year: '$created_at' }
                fromParts.year = "$_id.year";
        }

        switch (slice) {
            case 'year':
                sort['_id.year'] = 1;
                break;
            case 'month':
                sort['_id.year'] = 1;
                sort['_id.month'] = 1;
                break;
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
