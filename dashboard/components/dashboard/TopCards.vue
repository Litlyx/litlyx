<script lang="ts" setup>
import { ChartSpline, Earth, Timer, User } from 'lucide-vue-next';
import type { TopCardData } from './TopCard.vue';
import DateService, { type Slice } from '~/shared/services/DateService';

const snapshotStore = useSnapshotStore();

const { isDev, getData, setData } = useDev();


const chartSlice = computed<Slice>(() => {
    if (snapshotStore.duration <= 3) return 'hour';
    if (snapshotStore.duration <= 31 * 2) return 'day';
    return 'month';
});


const { data: visits, status: visitsStatus, refresh: visitsRefresh } = useAuthFetch<{ _id: string, count: number }[]>('/api/timeline/visits', {
    headers: {
        'x-slice': chartSlice
    },
    lazy: true,
    onResponse: (e) => {
        const time = e.response.headers.get('x-time');
        setData('topcard.time.visits', time ?? 0);
    }
});

const { data: bouncingRate, status: bouncingRateStatus, refresh: bouncingRateRefresh } = useAuthFetch<{ _id: string, count: number }[]>('/api/timeline/bouncing_rate', {
    headers: {
        'x-slice': chartSlice
    },
    lazy: true,
    onResponse: (e) => {
        const time = e.response.headers.get('x-time');
        setData('topcard.time.bouncingrate', time ?? 0);
    }
});

const { data: sessions, status: sessionsStatus, refresh: sessionsRefresh } = useAuthFetch<{ _id: string, count: number }[]>('/api/timeline/sessions', {
    headers: {
        'x-slice': chartSlice
    },
    lazy: true,
    onResponse: (e) => {
        const time = e.response.headers.get('x-time');
        setData('topcard.time.sessions', time ?? 0);
    }
});

const { data: durations, status: durationsStatus, refresh: durationsRefresh } = useAuthFetch<{ _id: string, count: number }[]>('/api/timeline/sessions_duration', {
    headers: {
        'x-slice': chartSlice
    },
    lazy: true,
    onResponse: (e) => {
        const time = e.response.headers.get('x-time');
        setData('topcard.time.visitsduration', time ?? 0);
    }
});

const todayIndex = computed(() => {
    if (!visits.value) return -1;
    const index = visits.value.findIndex(e => new Date(e._id).getTime() >= (Date.now()));
    return index;
});

const chartColor = useChartColor();



function movingAverage(data: number[], windowSize: number = 3): number[] {
    const result: number[] = [];

    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - Math.floor(windowSize / 2));
        const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
        const window = data.slice(start, end);
        const avg = window.reduce((sum, v) => sum + v, 0) / window.length;
        result.push(avg);
    }

    return result;
}

function logScale(data: number[], base: number = 10): number[] {
    return data.map(v => (v > 0 ? Math.log(v + 1) / Math.log(base) : 0));
}

const visitsData = computed<TopCardData>(() => {

    const count = visits.value?.reduce((a, e) => a + e.count, 0) ?? 0;
    const size = visits.value?.length ?? 1;

    const result: TopCardData = {
        text: 'Total visits' + (isDev.value ? getData('topcard.time.visits', ' |', 'ms') : ''),
        value: formatNumberK(count),
        sub: formatNumberK(count / size) + `/${chartSlice.value}`,
        icon: Earth,
        ready: visitsStatus.value == 'success',
        tooltip: 'Sum of all page views on your website.',
        color: chartColor.visits,
        todayIndex: todayIndex.value,
        chart_data: visits.value?.map(e => e.count) ?? [],
        chart_labels: visits.value?.map(e => DateService.getChartLabelFromISO(new Date(e._id).getTime(), chartSlice.value)) ?? []
    }
    return result;
});

const bouncingRateData = computed<TopCardData>(() => {

    const valueBouncing = bouncingRate.value ?? [];

    const samples = valueBouncing.map(e => e.count);

    const pool = valueBouncing.filter(e => e.count > 0);

    const count = pool.reduce((a, e) => a + e.count, 0);
    const size = pool.length ?? 1;

    const result: TopCardData = {
        text: 'Bouncing rate' + (isDev.value ? getData('topcard.time.bouncingrate', ' |', 'ms') : ''),
        value: (pool.length == 0 ? 0 : (count / size).toFixed(2)) + '%',
        sub: '',
        icon: ChartSpline,
        ready: bouncingRateStatus.value == 'success',
        tooltip: 'Percentage of users who leave quickly (lower is better).',
        color: '#1e9b86',
        todayIndex: todayIndex.value,
        chart_data: movingAverage(samples),
        chart_labels: bouncingRate.value?.map(e => DateService.getChartLabelFromISO(new Date(e._id).getTime(), chartSlice.value)) ?? []
    }
    return result;
});

const sessionsData = computed<TopCardData>(() => {

    const count = sessions.value?.reduce((a, e) => a + e.count, 0) ?? 0;
    const size = sessions.value?.length ?? 1;

    const result: TopCardData = {
        text: 'Unique visitors' + (isDev.value ? getData('topcard.time.sessions', ' |', 'ms') : ''),
        value: formatNumberK(count),
        sub: formatNumberK(count / size) + `/${chartSlice.value}`,
        icon: User,
        ready: sessionsStatus.value == 'success',
        tooltip: 'Count of distinct users visiting your website.',
        color: chartColor.sessions,
        todayIndex: todayIndex.value,
        chart_data: sessions.value?.map(e => e.count) ?? [],
        chart_labels: sessions.value?.map(e => DateService.getChartLabelFromISO(new Date(e._id).getTime(), chartSlice.value)) ?? []
    }
    return result;
});

const durationsData = computed<TopCardData>(() => {

    const valueDurations = durations.value ?? [];

    const samples = valueDurations.map(e => e.count);
    const highAnomalies = logScale(samples);

    const count = durations.value?.reduce((a, e) => a + e.count / ((e as any).sessions ?? 1), 0) ?? 0;
    const size = durations.value?.length ?? 1;

    const result: TopCardData = {
        text: 'Visit duration' + (isDev.value ? getData('topcard.time.visitsduration', ' |', 'ms') : ''),
        value: getPrettyTime((count / size)),
        sub: '',
        icon: Timer,
        ready: durationsStatus.value == 'success',
        tooltip: 'Average time users spend on your website.',
        color: '#f56523',
        todayIndex: todayIndex.value,
        chart_data: highAnomalies,
        chart_labels: durations.value?.map(e => DateService.getChartLabelFromISO(new Date(e._id).getTime(), chartSlice.value)) ?? []
    }
    return result;
});


function getPrettyTime(avg: number) {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    seconds += avg * 60;
    while (seconds >= 60) { seconds -= 60; minutes += 1; }
    while (minutes >= 60) { minutes -= 60; hours += 1; }
    // if (hours == 0 && minutes == 0 && seconds < 10) return `0m ~10s`
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds.toFixed()}s`
}


async function refresh() {
    await visitsRefresh();
    await bouncingRateRefresh();
    await sessionsRefresh();
    await durationsRefresh();
}

</script>


<template>
    <div v-if="isDev" class="bg-red-300/40 py-2 px-4 mb-2 rounded-md flex gap-2 items-center">
        <Label> Dev menu </Label>
        <Button size="sm" @click="refresh()"> Refresh </Button>
    </div>
    <div class="gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <DashboardTopCard :data="visitsData"
            class="bg-violet-500/10 dark:!bg-violet-500/10 !border-violet-800/20 dark:!border-violet-950">
        </DashboardTopCard>
        <DashboardTopCard :data="bouncingRateData"
            class="bg-teal-500/10 dark:!bg-teal-500/10 !border-teal-800/20 dark:!border-teal-950"></DashboardTopCard>
        <DashboardTopCard :data="sessionsData"
            class="bg-cyan-500/10 dark:!bg-cyan-500/10 !border-cyan-800/20 dark:!border-cyan-950"></DashboardTopCard>
        <DashboardTopCard :data="durationsData"
            class="bg-orange-500/10 dark:!bg-orange-500/10 !border-orange-500/20 dark:!border-orange-950">
        </DashboardTopCard>
    </div>

</template>