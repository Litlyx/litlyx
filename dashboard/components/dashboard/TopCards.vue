<script lang="ts" setup>

import DateService, { type Slice } from '../../shared/services/DateService';


const { snapshot, safeSnapshotDates, snapshotDuration } = useSnapshot()


const chartSlice = computed(() => {
    if (snapshotDuration.value <= 3) return 'hour' as Slice;
    if (snapshotDuration.value <= 31 * 2) return 'day' as Slice;
    return 'month' as Slice;
});


function findFirstZeroOrNullIndex(arr: (number | null)[]) {
    for (let i = 0; i < arr.length; i++) {
        if (arr.slice(i).every(val => val === 0 || val === null)) return i;
    }
    return -1;
}

function transformResponse(input: { _id: string, count: number }[]) {

    const data = input.map(e => e.count || 0);
    const labels = input.map(e => DateService.getChartLabelFromISO(e._id, new Date().getTimezoneOffset(), chartSlice.value));

    return { data, labels, input }

}

const visitsData = useFetch('/api/timeline/visits', {
    headers: useComputedHeaders({ slice: chartSlice }), lazy: true, transform: transformResponse
});

const sessionsData = useFetch('/api/timeline/sessions', {
    headers: useComputedHeaders({ slice: chartSlice }), lazy: true, transform: transformResponse
});
const sessionsDurationData = useFetch('/api/timeline/sessions_duration', {
    headers: useComputedHeaders({ slice: chartSlice }), lazy: true, transform: transformResponse
});
const bouncingRateData = useFetch('/api/timeline/bouncing_rate', {
    headers: useComputedHeaders({ slice: chartSlice }), lazy: true, transform: transformResponse
});

const avgVisitDay = computed(() => {
    if (!visitsData.data.value) return '0.00';
    const counts = visitsData.data.value.data.reduce((a, e) => e + a, 0);
    const avg = counts / Math.max(snapshotDuration.value, 1);
    return avg.toFixed(2);
});

const avgSessionsDay = computed(() => {
    if (!sessionsData.data.value) return '0.00';
    const counts = sessionsData.data.value.data.reduce((a, e) => e + a, 0);
    const avg = counts / Math.max(snapshotDuration.value, 1);
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

function weightedAverage(data: number[]): number {
    if (data.length === 0) return 0;

    // Compute median
    const sortedData = [...data].sort((a, b) => a - b);
    const middle = Math.floor(sortedData.length / 2);
    const median = sortedData.length % 2 === 0
        ? (sortedData[middle - 1] + sortedData[middle]) / 2
        : sortedData[middle];

    // Define a threshold (e.g., 3 times the median) to filter out extreme values
    const threshold = median * 3;
    const filteredData = data.filter(num => num <= threshold);

    if (filteredData.length === 0) return median; // Fallback to median if all are removed

    // Compute weights based on inverse absolute deviation from median
    const weights = filteredData.map(num => 1 / (1 + Math.abs(num - median)));

    // Compute weighted sum and sum of weights
    const weightedSum = filteredData.reduce((sum, num, i) => sum + num * weights[i], 0);
    const sumOfWeights = weights.reduce((sum, weight) => sum + weight, 0);

    return weightedSum / sumOfWeights;
}
const avgSessionDuration = computed(() => {
    if (!sessionsDurationData.data.value) return '0.00 %'

    const counts = sessionsDurationData.data.value.data
        // .filter(e => e > 0)
        .reduce((a, e) => e + a, 0);

    const avg = weightedAverage(sessionsDurationData.data.value.data);
    // counts / (Math.max(sessionsDurationData.data.value.data.length, 1));

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    seconds += avg * 60;
    while (seconds >= 60) { seconds -= 60; minutes += 1; }
    while (minutes >= 60) { minutes -= 60; hours += 1; }


    if (hours == 0 && minutes == 0 && seconds < 10) return `0m ~10s`
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds.toFixed()}s`
});

const todayIndex = computed(() => {
    if (!visitsData.data.value) return -1;
    return visitsData.data.value.input.findIndex(e => new Date(e._id).getTime() > (Date.now()));
})


</script>


<template>
    <div class="gap-6 px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 m-cards-wrap:grid-cols-4">

        <DashboardCountCard :todayIndex="todayIndex" :ready="!visitsData.pending.value" icon="far fa-earth"
            text="Total visits" :value="formatNumberK(visitsData.data.value?.data.reduce((a, e) => a + e, 0) || '...')"
            :avg="formatNumberK(avgVisitDay) + '/day'" :data="visitsData.data.value?.data"
            tooltipText="Sum of all page views on your website." :labels="visitsData.data.value?.labels"
            color="#5655d7">
        </DashboardCountCard>

        <DashboardCountCard :todayIndex="todayIndex" :ready="!bouncingRateData.pending.value" icon="far fa-chart-user"
            text="Bouncing rate" :value="avgBouncingRate" :slow="true" :data="bouncingRateData.data.value?.data"
            tooltipText="Percentage of users who leave quickly (lower is better)."
            :labels="bouncingRateData.data.value?.labels" color="#1e9b86">
        </DashboardCountCard>


        <DashboardCountCard :todayIndex="todayIndex" :ready="!sessionsData.pending.value" icon="far fa-user"
            text="Unique visitors"
            :value="formatNumberK(sessionsData.data.value?.data.reduce((a, e) => a + e, 0) || '...')"
            tooltipText="Count of distinct users visiting your website." :avg="formatNumberK(avgSessionsDay) + '/day'"
            :data="sessionsData.data.value?.data" :labels="sessionsData.data.value?.labels" color="#4abde8">
        </DashboardCountCard>


        <DashboardCountCard :todayIndex="todayIndex" :ready="!sessionsDurationData.pending.value" icon="far fa-timer"
            text="Visit duration" :value="avgSessionDuration" :data="sessionsDurationData.data.value?.data"
            tooltipText="Average time users spend on your website." :labels="sessionsDurationData.data.value?.labels"
            color="#f56523">
        </DashboardCountCard>

    </div>

</template>