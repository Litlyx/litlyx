<script lang="ts" setup>
import type { MetricsTimeline } from '~/server/api/metrics/[project_id]/timeline/generic';
import DateService from '@services/DateService';

const { data: metricsInfo } = useMetricsData();

const avgVisitDay = computed(() => {
    if (!metricsInfo.value) return '0.00';
    const days = (Date.now() - (metricsInfo.value?.firstViewDate || 0)) / 1000 / 60 / 60 / 24;
    const avg = metricsInfo.value.visitsCount / Math.max(days, 1);
    return avg.toFixed(2);
});

const avgEventsDay = computed(() => {
    if (!metricsInfo.value) return '0.00';
    const days = (Date.now() - (metricsInfo.value?.firstEventDate || 0)) / 1000 / 60 / 60 / 24;
    const avg = metricsInfo.value.eventsCount / Math.max(days, 1);
    return avg.toFixed(2);
});

const avgSessionsDay = computed(() => {
    if (!metricsInfo.value) return '0.00';
    const days = (Date.now() - (metricsInfo.value?.firstViewDate || 0)) / 1000 / 60 / 60 / 24;
    const avg = metricsInfo.value.sessionsVisitsCount / Math.max(days, 1);
    return avg.toFixed(2);
});


const avgSessionDuration = computed(() => {
    if (!metricsInfo.value) return '0.00';
    const avg = metricsInfo.value.avgSessionDuration;

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    seconds += avg * 60;

    while (seconds > 60) {
        seconds -= 60;
        minutes += 1;
    }

    while (minutes > 60) {
        minutes -= 60;
        hours += 1;
    }


    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds.toFixed()}s`
});

type Data = {
    data: number[],
    labels: string[],
    trend: number,
    ready: boolean
}


const visitsData = reactive<Data>({ data: [], labels: [], trend: 0, ready: false });
const eventsData = reactive<Data>({ data: [], labels: [], trend: 0, ready: false });
const sessionsData = reactive<Data>({ data: [], labels: [], trend: 0, ready: false });
const sessionsDurationData = reactive<Data>({ data: [], labels: [], trend: 0, ready: false });

async function loadData(timelineEndpointName: string, target: Data) {

    const response = await useTimeline(timelineEndpointName as any, 'day');
    if (!response) return;
    target.data = response.map(e => e.count);
    target.labels = response.map(e => DateService.getChartLabelFromISO(e._id, navigator.language, 'day'));

    const pool = [...response.map(e => e.count)];
    pool.pop();
    const avg = pool.reduce((a, e) => a + e, 0) / pool.length;

    const diffPercent: number = (100 / avg * (response.at(-1)?.count || 0)) - 100;

    target.trend = Math.max(Math.min(diffPercent, 99), -99);

    target.ready = true;
}

onMounted(async () => {

    await loadData('visits', visitsData);
    await loadData('events', eventsData);
    await loadData('sessions', sessionsData);
    await loadData('sessions_duration', sessionsDurationData);

});



</script>


<template>
    <div class="gap-6 px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 m-cards-wrap:grid-cols-4" v-if="metricsInfo">

        <DashboardCountCard :ready="visitsData.ready" icon="far fa-earth" text="Total page visits"
            :value="formatNumberK(metricsInfo.visitsCount)" :avg="formatNumberK(avgVisitDay) + '/day'"
            :trend="visitsData.trend" :data="visitsData.data" :labels="visitsData.labels" color="#5655d7">
        </DashboardCountCard>

        <DashboardCountCard :ready="eventsData.ready" icon="far fa-flag" text="Total custom events"
            :value="formatNumberK(metricsInfo.eventsCount)" :avg="formatNumberK(avgEventsDay) + '/day'"
            :trend="eventsData.trend" :data="eventsData.data" :labels="eventsData.labels" color="#1e9b86">
        </DashboardCountCard>

        <DashboardCountCard :ready="sessionsData.ready" icon="far fa-user" text="Unique visits sessions"
            :value="formatNumberK(metricsInfo.sessionsVisitsCount)" :avg="formatNumberK(avgSessionsDay) + '/day'"
            :trend="sessionsData.trend" :data="sessionsData.data" :labels="sessionsData.labels" color="#4abde8">
        </DashboardCountCard>

        <DashboardCountCard :ready="sessionsDurationData.ready" icon="far fa-timer" text="Avg session time"
            :value="avgSessionDuration" :trend="sessionsDurationData.trend" :data="sessionsDurationData.data"
            :labels="sessionsDurationData.labels" color="#f56523">
        </DashboardCountCard>

    </div>

</template>
