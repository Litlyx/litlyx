<script lang="ts" setup>

import DateService from '@services/DateService';
import type { Slice } from '@services/DateService';

const { data: metricsInfo } = useMetricsData();

const { snapshot, safeSnapshotDates } = useSnapshot()

const snapshotFrom = computed(() => new Date(snapshot.value?.from || '0').getTime());
const snapshotTo = computed(() => new Date(snapshot.value?.to || Date.now()).getTime());

const snapshotDays = computed(() => {
    return (snapshotTo.value - snapshotFrom.value) / 1000 / 60 / 60 / 24;
});

const avgVisitDay = computed(() => {
    if (!visitsData.data.value) return '0.00';
    const counts = visitsData.data.value.data.reduce((a, e) => e + a, 0);
    const avg = counts / Math.max(snapshotDays.value, 1);
    return avg.toFixed(2);
});

const avgEventsDay = computed(() => {
    if (!eventsData.data.value) return '0.00';
    const counts = eventsData.data.value.data.reduce((a, e) => e + a, 0);
    const avg = counts / Math.max(snapshotDays.value, 1);
    return avg.toFixed(2);
});

const avgSessionsDay = computed(() => {
    if (!sessionsData.data.value) return '0.00';
    const counts = sessionsData.data.value.data.reduce((a, e) => e + a, 0);
    const avg = counts / Math.max(snapshotDays.value, 1);
    return avg.toFixed(2);
});


const avgSessionDuration = computed(() => {
    if (!metricsInfo.value) return '0.00';
    const avg = metricsInfo.value.avgSessionDuration;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    seconds += avg * 60;
    while (seconds > 60) { seconds -= 60; minutes += 1; }
    while (minutes > 60) { minutes -= 60; hours += 1; }
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds.toFixed()}s`
});


const chartSlice = computed(() => {
    const snapshotSizeMs = new Date(snapshot.value.to).getTime() - new Date(snapshot.value.from).getTime();
    if (snapshotSizeMs < 1000 * 60 * 60 * 24 * 6) return 'hour' as Slice;
    if (snapshotSizeMs < 1000 * 60 * 60 * 24 * 30) return 'day' as Slice;
    if (snapshotSizeMs < 1000 * 60 * 60 * 24 * 90) return 'day' as Slice;
    return 'month' as Slice;
});


function transformResponse(input: { _id: string, count: number }[]) {
    const data = input.map(e => e.count);
    const labels = input.map(e => DateService.getChartLabelFromISO(e._id, navigator.language, chartSlice.value));
    const pool = [...input.map(e => e.count)];
    pool.pop();
    const avg = pool.reduce((a, e) => a + e, 0) / pool.length;
    const diffPercent: number = (100 / avg * (input.at(-1)?.count || 0)) - 100;
    const trend = Math.max(Math.min(diffPercent, 99), -99);
    return { data, labels, trend }
}

const activeProject = useActiveProject();

function getBody() {
    return JSON.stringify({
        from: safeSnapshotDates.value.from,
        to: safeSnapshotDates.value.to,
        slice: chartSlice.value
    });
}

const visitsData = useFetch(`/api/metrics/${activeProject.value?._id}/timeline/visits`, {
    method: 'POST', ...signHeaders({ v2: 'true' }), body: getBody(), transform: transformResponse,
    lazy: true, immediate: false
});

const eventsData = useFetch(`/api/metrics/${activeProject.value?._id}/timeline/events`, {
    method: 'POST', ...signHeaders({ v2: 'true' }), body: getBody(), transform: transformResponse,
    lazy: true, immediate: false
});

const sessionsData = useFetch(`/api/metrics/${activeProject.value?._id}/timeline/sessions`, {
    method: 'POST', ...signHeaders({ v2: 'true' }), body: getBody(), transform: transformResponse,
    lazy: true, immediate: false
});

const sessionsDurationData = useFetch(`/api/metrics/${activeProject.value?._id}/timeline/sessions_duration`, {
    method: 'POST', ...signHeaders({ v2: 'true' }), body: getBody(), transform: transformResponse,
    lazy: true, immediate: false
});


onMounted(async () => {
    visitsData.execute();
    eventsData.execute();
    sessionsData.execute();
    sessionsDurationData.execute();
});


</script>


<template>
    <div class="gap-6 px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 m-cards-wrap:grid-cols-4">

        <DashboardCountCard :ready="!visitsData.pending.value" icon="far fa-earth" text="Total page visits"
            :value="formatNumberK(visitsData.data.value?.data.reduce((a, e) => a + e, 0) || '...')"
            :avg="formatNumberK(avgVisitDay) + '/day'" :trend="visitsData.data.value?.trend"
            :data="visitsData.data.value?.data" :labels="visitsData.data.value?.labels" color="#5655d7">
        </DashboardCountCard>

        <DashboardCountCard :ready="!eventsData.pending.value" icon="far fa-flag" text="Total custom events"
            :value="formatNumberK(eventsData.data.value?.data.reduce((a, e) => a + e, 0) || '...')"
            :avg="formatNumberK(avgEventsDay) + '/day'" :trend="eventsData.data.value?.trend"
            :data="eventsData.data.value?.data" :labels="eventsData.data.value?.labels" color="#1e9b86">
        </DashboardCountCard>


        <DashboardCountCard :ready="!sessionsData.pending.value" icon="far fa-user" text="Unique visits sessions"
            :value="formatNumberK(sessionsData.data.value?.data.reduce((a, e) => a + e, 0) || '...')"
            :avg="formatNumberK(avgSessionsDay) + '/day'" :trend="sessionsData.data.value?.trend"
            :data="sessionsData.data.value?.data" :labels="sessionsData.data.value?.labels" color="#4abde8">
        </DashboardCountCard>


        <DashboardCountCard :ready="!sessionsDurationData.pending.value" icon="far fa-timer" text="Avg session time"
            :value="avgSessionDuration" :trend="sessionsDurationData.data.value?.trend"
            :data="sessionsDurationData.data.value?.data" :labels="sessionsDurationData.data.value?.labels"
            color="#f56523">
        </DashboardCountCard>

    </div>

</template>
