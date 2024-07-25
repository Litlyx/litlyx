<script lang="ts" setup>

import DateService from '@services/DateService';

const { data: metricsInfo } = useMetricsData();




type Data = {
    data: number[],
    labels: string[],
    trend: number,
    ready: boolean
}


const { snapshot } = useSnapshot()

const visitsData = reactive<Data>({ data: [], labels: [], trend: 0, ready: false });
const eventsData = reactive<Data>({ data: [], labels: [], trend: 0, ready: false });
const sessionsData = reactive<Data>({ data: [], labels: [], trend: 0, ready: false });
const sessionsDurationData = reactive<Data>({ data: [], labels: [], trend: 0, ready: false });

const snapshotFrom = computed(() => {
    return new Date(snapshot.value?.from || '0').getTime();
});

const snapshotTo = computed(() => {
    return new Date(snapshot.value?.to || Date.now()).getTime();
});

const avgVisitDay = computed(() => {
    const days = (snapshotTo.value - snapshotFrom.value) / 1000 / 60 / 60 / 24;
    const counts = visitsData.data.reduce((a, e) => e + a, 0);
    const avg = counts / Math.max(days, 1);
    return avg.toFixed(2);
});

const avgEventsDay = computed(() => {
    const days = (snapshotTo.value - snapshotFrom.value) / 1000 / 60 / 60 / 24;
    const counts = eventsData.data.reduce((a, e) => e + a, 0);
    const avg = counts / Math.max(days, 1);
    return avg.toFixed(2);
});

const avgSessionsDay = computed(() => {
    const days = (snapshotTo.value - snapshotFrom.value) / 1000 / 60 / 60 / 24;
    const counts = sessionsData.data.reduce((a, e) => e + a, 0);
    const avg = counts / Math.max(days, 1);
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

async function loadData(timelineEndpointName: string, target: Data) {

    target.ready = false;

    const response = await useTimeline(timelineEndpointName as any, 'day',
        snapshot.value?.from.toString() || "0",
        snapshot.value?.to.toString() || Date.now().toString()
    );

    console.log(timelineEndpointName,response);

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


async function loadAllData() {
    console.log('LOAD ALL DATA')
    await Promise.all([
        loadData('visits', visitsData),
        loadData('events', eventsData),
        loadData('sessions', sessionsData),
        loadData('sessions_duration', sessionsDurationData),
    ])
}

onMounted(async () => {

    await loadAllData();
    watch(snapshot, async () => {
        await loadAllData();
    })

});



</script>


<template>
    <div class="gap-6 px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 m-cards-wrap:grid-cols-4" v-if="metricsInfo">

        <DashboardCountCard :ready="visitsData.ready" icon="far fa-earth" text="Total page visits"
            :value="formatNumberK(visitsData.data.reduce((a, e) => a + e, 0))"
            :avg="formatNumberK(avgVisitDay) + '/day'" :trend="visitsData.trend" :data="visitsData.data"
            :labels="visitsData.labels" color="#5655d7">
        </DashboardCountCard>

        <DashboardCountCard :ready="eventsData.ready" icon="far fa-flag" text="Total custom events"
            :value="formatNumberK(eventsData.data.reduce((a, e) => a + e, 0))" :avg="formatNumberK(avgEventsDay) + '/day'"
            :trend="eventsData.trend" :data="eventsData.data" :labels="eventsData.labels" color="#1e9b86">
        </DashboardCountCard>

        <DashboardCountCard :ready="sessionsData.ready" icon="far fa-user" text="Unique visits sessions"
            :value="formatNumberK(sessionsData.data.reduce((a, e) => a + e, 0))" :avg="formatNumberK(avgSessionsDay) + '/day'"
            :trend="sessionsData.trend" :data="sessionsData.data" :labels="sessionsData.labels" color="#4abde8">
        </DashboardCountCard>

        <DashboardCountCard :ready="sessionsDurationData.ready" icon="far fa-timer" text="Avg session time"
            :value="avgSessionDuration" :trend="sessionsDurationData.trend" :data="sessionsDurationData.data"
            :labels="sessionsDurationData.labels" color="#f56523">
        </DashboardCountCard>

    </div>

</template>
