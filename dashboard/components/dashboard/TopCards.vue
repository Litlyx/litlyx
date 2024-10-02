<script lang="ts" setup>

import DateService from '@services/DateService';
import type { Slice } from '@services/DateService';

const { snapshot, safeSnapshotDates } = useSnapshot()

const snapshotDays = computed(() => {
    const to = new Date(safeSnapshotDates.value.to).getTime();
    const from = new Date(safeSnapshotDates.value.from).getTime();
    return (to - from) / 1000 / 60 / 60 / 24;
});

const chartSlice = computed(() => {
    const snapshotSizeMs = new Date(snapshot.value.to).getTime() - new Date(snapshot.value.from).getTime();
    if (snapshotSizeMs < 1000 * 60 * 60 * 24 * 6) return 'hour' as Slice;
    if (snapshotSizeMs < 1000 * 60 * 60 * 24 * 30) return 'day' as Slice;
    if (snapshotSizeMs < 1000 * 60 * 60 * 24 * 90) return 'day' as Slice;
    return 'month' as Slice;
});


function transformResponse(input: { _id: string, count: number }[]) {
    const data = input.map(e => e.count || 0);
    const labels = input.map(e => DateService.getChartLabelFromISO(e._id, navigator.language, chartSlice.value));
    const pool = [...input.map(e => e.count || 0)];
    pool.pop();
    const avg = pool.reduce((a, e) => a + e, 0) / pool.length;
    const diffPercent: number = (100 / avg * (input.at(-1)?.count || 0)) - 100;
    const trend = Math.max(Math.min(diffPercent, 99), -99);
    return { data, labels, trend }
}

const visitsData = useFetch('/api/timeline/visits', {
    headers: useComputedHeaders({ slice: chartSlice.value }), lazy: true, transform: transformResponse
});
const sessionsData = useFetch('/api/timeline/sessions', {
    headers: useComputedHeaders({ slice: chartSlice.value }), lazy: true, transform: transformResponse
});
const sessionsDurationData = useFetch('/api/timeline/sessions_duration', {
    headers: useComputedHeaders({ slice: chartSlice.value }), lazy: true, transform: transformResponse
});
const bouncingRateData = useFetch('/api/timeline/bouncing_rate', {
    headers: useComputedHeaders({ slice: chartSlice.value }), lazy: true, transform: transformResponse
});

const avgVisitDay = computed(() => {
    if (!visitsData.data.value) return '0.00';
    const counts = visitsData.data.value.data.reduce((a, e) => e + a, 0);
    const avg = counts / Math.max(snapshotDays.value, 1);
    return avg.toFixed(2);
});

const avgSessionsDay = computed(() => {
    if (!sessionsData.data.value) return '0.00';
    const counts = sessionsData.data.value.data.reduce((a, e) => e + a, 0);
    const avg = counts / Math.max(snapshotDays.value, 1);
    return avg.toFixed(2);
});

const avgBouncingRate = computed(() => {
    if (!bouncingRateData.data.value) return '0.00 %'

    const counts = bouncingRateData.data.value.data
        .filter(e => e > 0)
        .reduce((a, e) => e + a, 0);

    const avg = counts / Math.max(bouncingRateData.data.value.data.filter(e => e > 0).length, 1);
    return avg.toFixed(2) + ' %';
})

const avgSessionDuration = computed(() => {
    if (!sessionsDurationData.data.value) return '0.00 %'

    const counts = sessionsDurationData.data.value.data
        .filter(e => e > 0)
        .reduce((a, e) => e + a, 0);

    const avg = counts / Math.max(sessionsDurationData.data.value.data.filter(e => e > 0).length, 1);

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    seconds += avg * 60;
    while (seconds > 60) { seconds -= 60; minutes += 1; }
    while (minutes > 60) { minutes -= 60; hours += 1; }
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds.toFixed()}s`
});


</script>


<template>
    <div class="gap-6 px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 m-cards-wrap:grid-cols-4">

        <DashboardCountCard :ready="!visitsData.pending.value" icon="far fa-earth" text="Total page visits"
            :value="formatNumberK(visitsData.data.value?.data.reduce((a, e) => a + e, 0) || '...')"
            :avg="formatNumberK(avgVisitDay) + '/day'" :trend="visitsData.data.value?.trend"
            :data="visitsData.data.value?.data" :labels="visitsData.data.value?.labels" color="#5655d7">
        </DashboardCountCard>

        <DashboardCountCard :ready="!bouncingRateData.pending.value" icon="far fa-chart-user" text="Bouncing rate"
            :value="avgBouncingRate" :trend="bouncingRateData.data.value?.trend" :slow="true"
            :data="bouncingRateData.data.value?.data" :labels="bouncingRateData.data.value?.labels" color="#1e9b86">
        </DashboardCountCard>


        <DashboardCountCard :ready="!sessionsData.pending.value" icon="far fa-user" text="Unique visits sessions"
            :value="formatNumberK(sessionsData.data.value?.data.reduce((a, e) => a + e, 0) || '...')"
            :avg="formatNumberK(avgSessionsDay) + '/day'" :trend="sessionsData.data.value?.trend"
            :data="sessionsData.data.value?.data" :labels="sessionsData.data.value?.labels" color="#4abde8">
        </DashboardCountCard>


        <DashboardCountCard :ready="!sessionsDurationData.pending.value" icon="far fa-timer"
            text="Total avg session time" :value="avgSessionDuration" :trend="sessionsDurationData.data.value?.trend"
            :data="sessionsDurationData.data.value?.data" :labels="sessionsDurationData.data.value?.labels"
            color="#f56523">
        </DashboardCountCard>

    </div>

</template>