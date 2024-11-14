import type { MetricsTimeline } from "~/server/api/metrics/[project_id]/timeline/generic";



// Calcola date snapshot
// 1- Frontend
// 2- Backend
// 3- Data singola

// 4- Aggregazione

// ISO
// UTC UTENTE

// Utility - per date snapshot

// getStartDay: data => 00.00 della data
// getEndDay: data => 23.59 della data

// getStartWeek: data => 00.00 del primo giorno
// getEndWeek: data => 23.59 dell ultimo giorno

// getStartMonth: data => 00.00 del primo giorno del mese
// getEndMonth: data => 23.59 dell ulrimo giorno del mese




// Snapshot -> Current Week -> 11/11-00:00 - 17/11-23:59
// Converti UTC UTENTE -> ISO

// Backend -> Prendi dati da ISO_A a ISO_B

// Funzioni da creare

// UTC TO ISO
// Converte utc -> Iso
// UTC TO ISO Day

// UTC TO ISO Month

// UTC_IS_NEXT_DAY
// True se il giorno passa a quello successivo
// UTC_IS_PREV_DAY
// True se il giorno passa a quello precedente









export const slicesData = {
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

export type SliceName = keyof typeof slicesData;

export const hoursOffset = -(new Date().getTimezoneOffset() / 60);

function matchDateWithSlice(a: Date, b: Date, slice: SliceName): boolean {
    if (a.getFullYear() != b.getFullYear()) return false;
    if (a.getMonth() != b.getMonth()) return false;
    if (slice === 'month') return true;
    if (a.getDate() != b.getDate()) return false;
    if (slice === 'day') return true;
    if (a.getHours() != b.getHours()) return false;
    if (slice === 'hour') return true;
    return true;
}

type FixMetricsOptions = {
    advanced?: boolean,
    advancedGroupKey?: string,
    timeLabels?: boolean
}
export function fixMetrics(result: { data: MetricsTimeline[], from: string, to: string }, slice: SliceName, _options?: FixMetricsOptions) {

    const options = {
        advanced: false,
        advancedGroupKey: 'default',
        timeLabels: false,
        ..._options
    }

    const allDates: Date[] = [];

    let currentDate = new Date(result.from);
    while (currentDate <= new Date(result.to)) {
        allDates.push(new Date(currentDate));
        if (slice == 'hour') {
            currentDate.setHours(currentDate.getHours() + 1);
        } else if (slice == 'day') {
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (slice == 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else if (slice == 'year') {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
    }

    const allKeys = !options.advanced ? [] : Array.from(new Set(result.data.map((e: any) => e[options.advancedGroupKey])).values());

    console.log({ allKeys, allDates })

    const fixed: any[] = allDates.map(matchDate => {

        if (!options.advanced) {
            const target = result.data.find(e => matchDateWithSlice(new Date(e._id), matchDate, slice));
            return { _id: target ? new Date(target._id) : matchDate, count: target?.count || 0 }
        }

        const targets = result.data.filter(e => matchDateWithSlice(new Date(e._id), matchDate, slice));

        const returnObject: any = {
            _id: targets.length == 0 ? matchDate : new Date(targets[0]._id),
            count: allKeys.map(e => {
                return {
                    key: e,
                    value: targets.find((k: any) => k[options.advancedGroupKey] == e)?.count || 0
                }
            })
        }

        return returnObject;
    });


    if (slice === 'day' || slice == 'hour') fixed.pop();

    const data = fixed.map(e => e.count);
    const avgTrend = data.slice(0, -1).reduce((a, e) => a + e, 0) / (data.length - 1);
    const t = data.at(-1) || 0;
    const trend = (100 / avgTrend * t) - 100;

    return {
        labels: options.timeLabels ?
            fixed.map(e => {
                return e._id;
            }) : fixed.map(e => {
                if (slice == 'hour') {
                    return `${e._id.getHours().toString().padStart(2, '0')}:00`
                } else if (slice == 'day') {
                    return `${e._id.getDate().toString().padStart(2, '0')}/${(e._id.getMonth() + 1).toString().padStart(2, '0')}`
                } else if (slice == 'month') {
                    return `${(e._id.getMonth() + 1).toString().padStart(2, '0')}/${e._id.getFullYear().toString()}`
                } else if (slice == 'year') {
                    return `${e._id.getFullYear().toString()}`
                } else {
                    return '???'
                }
            }),
        data,
        trend,
        allKeys
    }


}
