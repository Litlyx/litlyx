<script lang="ts" setup>
import DateService, { type Slice } from '@services/DateService';
import type { ChartData, ChartOptions, TooltipModel } from 'chart.js';
import { useLineChart, LineChart } from 'vue-chart-3';
import * as fns from 'date-fns';

const props = defineProps<{ pid: string }>();

const errorData = ref<{ errored: boolean, text: string }>({ errored: false, text: '' })

function createGradient(startColor: string) {
    const c = document.createElement('canvas');
    const ctx = c.getContext("2d");
    let gradient: any = `${startColor}22`;
    if (ctx) {
        gradient = ctx.createLinearGradient(0, 25, 0, 300);
        gradient.addColorStop(0, `${startColor}99`);
        gradient.addColorStop(0.35, `${startColor}66`);
        gradient.addColorStop(1, `${startColor}22`);
    } else {
        console.warn('Cannot get context for gradient');
    }

    return gradient;
}

const chartOptions = ref<ChartOptions<'line'>>({
    responsive: true,
    maintainAspectRatio: false,
    interaction: (false as any),
    scales: {
        y: {
            ticks: { display: true },
            grid: {
                display: true,
                drawBorder: false,
                color: '#CCCCCC22',
                // borderDash: [5, 10]
            },
            beginAtZero: true,
        },
        x: {
            ticks: { display: true },
            stacked: false,
            offset: false,
            grid: {
                display: true,
                drawBorder: false,
                color: '#CCCCCC22',
            }
        }
    },
    plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: { enabled: false }
    },
});

const chartData = ref<ChartData<'line' | 'bar' | 'bubble'>>({
    labels: [],
    datasets: [
        {
            label: 'Visits',
            data: [],
            backgroundColor: ['#5655d7'],
            borderColor: '#5655d7',
            borderWidth: 4,
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 10,
            hoverBackgroundColor: '#5655d7',
            hoverBorderColor: 'white',
            hoverBorderWidth: 2,
            segment: {
                borderColor(ctx, options) {
                    const todayIndex = visitsData.data.value?.todayIndex;
                    if (!todayIndex || todayIndex == -1) return '#5655d7';
                    if (ctx.p1DataIndex >= todayIndex) return '#5655d700';
                    return '#5655d7'
                },
                borderDash(ctx, options) {
                    const todayIndex = visitsData.data.value?.todayIndex;
                    if (!todayIndex || todayIndex == -1) return undefined;
                    if (ctx.p1DataIndex == todayIndex - 1) return [3, 5];
                    return undefined;
                },
                backgroundColor(ctx, options) {
                    const todayIndex = visitsData.data.value?.todayIndex;
                    if (!todayIndex || todayIndex == -1) return createGradient('#5655d7');
                    if (ctx.p1DataIndex >= todayIndex) return '#5655d700';
                    return createGradient('#5655d7');
                },
            },
        },
        {
            label: 'Unique visitors',
            data: [],
            backgroundColor: ['#4abde8'],
            borderColor: '#4abde8',
            borderWidth: 2,
            hoverBackgroundColor: '#4abde8',
            hoverBorderColor: '#4abde8',
            hoverBorderWidth: 2,
            type: 'bar',
            // barThickness: 20,
            borderSkipped: ['bottom'],
        },
        {
            label: 'Events',
            data: [],
            backgroundColor: ['#fbbf24'],
            borderWidth: 2,
            hoverBackgroundColor: '#fbbf24',
            hoverBorderColor: '#fbbf24',
            hoverBorderWidth: 2,
            type: 'bubble',
            stack: 'combined',
            borderColor: ["#fbbf24"]
        },
    ],
});

const { lineChartProps, lineChartRef, update: updateChart } = useLineChart({ chartData: (chartData as any), options: chartOptions });

const selectedSlice: Slice = 'day'

const allDatesFull = ref<string[]>([]);


function transformResponse(input: { _id: string, count: number }[]) {
    const data = input.map(e => e.count);
    const labels = input.map(e => DateService.getChartLabelFromISO(e._id, new Date().getTimezoneOffset(), selectedSlice));
    if (input.length > 0) allDatesFull.value = input.map(e => e._id.toString());

    const todayIndex = input.findIndex(e => new Date(e._id).getTime() > (Date.now() - new Date().getTimezoneOffset() * 1000 * 60));

    return { data, labels, todayIndex }
}

function onResponseError(e: any) {
    let message = e.response._data.message ?? 'Generic error';
    if (message == 'internal server error') message = 'Please change slice';
    errorData.value = { errored: true, text: message }
}

function onResponse(e: any) {
    if (e.response.status != 500) errorData.value = { errored: false, text: '' }
}


const headers = computed(() => {
    return {
        'x-from': fns.startOfWeek(fns.subWeeks(Date.now(), 1)).toISOString(),
        'x-to': fns.endOfWeek(fns.subWeeks(Date.now(), 1)).toISOString(),
        'x-pid': props.pid
    }
});

const visitsData = useFetch(`/api/timeline/visits?pid=${props.pid}`, {
    headers: useComputedHeaders({
        slice: selectedSlice,
        custom: { ...headers.value },
        useActivePid: false,
        useActiveDomain: false
    }),
    lazy: true,
    transform: transformResponse, onResponseError, onResponse
});

const sessionsData = useFetch(`/api/timeline/sessions?pid=${props.pid}`, {
    headers: useComputedHeaders({
        slice: selectedSlice,
        custom: { ...headers.value },
        useActivePid: false,
        useActiveDomain: false
    }), lazy: true,
    transform: transformResponse, onResponseError, onResponse
});

const eventsData = useFetch(`/api/timeline/events?pid=${props.pid}`, {
    headers: useComputedHeaders({
        slice: selectedSlice,
        custom: { ...headers.value },
        useActivePid: false,
        useActiveDomain: false
    }), lazy: true,
    transform: transformResponse, onResponseError, onResponse
});

const readyToDisplay = computed(() => !visitsData.pending.value && !eventsData.pending.value && !sessionsData.pending.value);

watch(readyToDisplay, () => {
    if (readyToDisplay.value === true) onDataReady();
})


function onDataReady() {
    if (!visitsData.data.value) return;
    if (!eventsData.data.value) return;
    if (!sessionsData.data.value) return;

    chartData.value.labels = visitsData.data.value.labels;

    const maxChartY = Math.max(...visitsData.data.value.data, ...sessionsData.data.value.data);
    const maxEventSize = Math.max(...eventsData.data.value.data)

    chartData.value.datasets[0].data = visitsData.data.value.data;
    chartData.value.datasets[1].data = sessionsData.data.value.data;

    chartData.value.datasets[2].data = eventsData.data.value.data.map(e => {
        const rValue = 20 / maxEventSize * e;
        return { x: 0, y: maxChartY + 20, r: isNaN(rValue) ? 0 : rValue, r2: e }
    });


    chartData.value.datasets[0].backgroundColor = [createGradient('#5655d7')];
    chartData.value.datasets[1].backgroundColor = [createGradient('#4abde8')];
    chartData.value.datasets[2].backgroundColor = [createGradient('#fbbf24')];


    (chartData.value.datasets[1] as any).borderSkipped = sessionsData.data.value.data.map((e, i) => {
        const todayIndex = eventsData.data.value?.todayIndex || 0;
        if (i == todayIndex - 1) return true;
        return 'bottom';
    });

    chartData.value.datasets[2].borderColor = eventsData.data.value.data.map((e, i) => {
        const todayIndex = eventsData.data.value?.todayIndex || 0;
        if (i == todayIndex - 1) return '#fbbf2400';
        return '#fbbf24';
    });

    updateChart();
}


</script>

<template>

    <div class="h-[10rem] w-full flex">
        <div v-if="!readyToDisplay" class="w-full flex justify-center items-center">
            <i class="fas fa-spinner text-[2rem] text-accent animate-[spin_1s_linear_infinite] duration-500"></i>
        </div>

        <div class="flex flex-col items-end w-full" v-if="readyToDisplay && !errorData.errored">
            <LineChart ref="lineChartRef" class="w-full h-full" v-bind="lineChartProps"> </LineChart>
        </div>

        <div v-if="errorData.errored" class="flex items-center justify-center py-8">
            {{ errorData.text }}
        </div>

    </div>


</template>

<style lang="scss" scoped>
#external-tooltip {
    border-radius: 3px;
    color: white;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transform: translate(-50%, 0);
    transition: all .1s ease;
}
</style>