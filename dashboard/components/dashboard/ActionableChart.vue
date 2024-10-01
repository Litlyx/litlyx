<script lang="ts" setup>
import { onMounted } from 'vue';
import DateService, { type Slice } from '@services/DateService';
import type { ChartData, ChartOptions, TooltipModel } from 'chart.js';
import { useLineChart, LineChart } from 'vue-chart-3';
registerChartComponents();

const errorData = ref<{ errored: boolean, text: string }>({
    errored: false,
    text: ''
})

const chartOptions = ref<ChartOptions<'line'>>({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        intersect: false,
        mode: 'nearest',
        axis: 'x',
        includeInvisible: true
    },
    scales: {
        y: {
            ticks: { display: true },
            grid: {
                display: true,
                drawBorder: false,
                color: '#CCCCCC22',
                // borderDash: [5, 10]
            },
        },
        x: {
            ticks: { display: true },
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
        tooltip: {
            // enabled: true,
            // backgroundColor: 'rgba(0, 0, 0, 0.8)',
            // titleFont: { size: 16, weight: 'bold' },
            // bodyFont: { size: 14 },
            // padding: 10,
            // cornerRadius: 4,
            // boxPadding: 10,
            // caretPadding: 20,
            // yAlign: 'bottom',
            // xAlign: 'center',
            enabled: false,
            position: 'nearest',
            external: externalTooltipHandler
        }
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
            tension: 0.45,
            pointRadius: 0,
            pointHoverRadius: 10,
            hoverBackgroundColor: '#5655d7',
            hoverBorderColor: 'white',
            hoverBorderWidth: 2,
        },
        {
            label: 'Unique sessions',
            data: [],
            backgroundColor: ['#4abde8'],
            borderColor: '#4abde8',
            borderWidth: 2,
            hoverBackgroundColor: '#4abde8',
            hoverBorderColor: '#4abde8',
            hoverBorderWidth: 2,
            type: 'bar'
        },
        {
            label: 'Events',
            data: [],
            backgroundColor: ['#fbbf24'],
            borderColor: '#fbbf24',
            borderWidth: 2,
            hoverBackgroundColor: '#fbbf24',
            hoverBorderColor: '#fbbf24',
            hoverBorderWidth: 2,
            type: 'bubble',
            stack: 'combined'
        },
    ],
});


const { lineChartProps, lineChartRef, update: updateChart } = useLineChart({ chartData: (chartData as any), options: chartOptions });

const externalTooltipElement = ref<null | HTMLDivElement>(null);

function externalTooltipHandler(context: { chart: any, tooltip: TooltipModel<'line' | 'bar'> }) {
    const { chart, tooltip } = context;
    const tooltipEl = externalTooltipElement.value;

    currentTooltipData.value.visits = (tooltip.dataPoints.find(e => e.datasetIndex == 0)?.raw) as number;
    currentTooltipData.value.sessions = (tooltip.dataPoints.find(e => e.datasetIndex == 1)?.raw) as number;
    currentTooltipData.value.events = ((tooltip.dataPoints.find(e => e.datasetIndex == 2)?.raw) as any)?.r2 as number;

    currentTooltipData.value.date = new Date(allDatesFull.value[tooltip.dataPoints[0].dataIndex]).toLocaleDateString();

    if (!tooltipEl) return;
    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = '0';
        return;
    }
    const { left: positionX, top: positionY } = chart.canvas.getBoundingClientRect();


    const xSwap = tooltip.caretX > (window.innerWidth * 0.5) ? -450 : -100;

    tooltipEl.style.opacity = '1';

    tooltipEl.style.left = positionX + (tooltip.caretX + xSwap) + 'px';

    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';

}


const selectLabels: { label: string, value: Slice }[] = [
    { label: 'Hour', value: 'hour' },
    { label: 'Day', value: 'day' },
    { label: 'Month', value: 'month' },
];

const selectedLabelIndex = ref<number>(1);


const activeProject = useActiveProject();

const { safeSnapshotDates } = useSnapshot()

const allDatesFull = ref<string[]>([]);

function transformResponse(input: { _id: string, count: number }[]) {
    const data = input.map(e => e.count);
    const labels = input.map(e => DateService.getChartLabelFromISO(e._id, navigator.language, selectLabels[selectedLabelIndex.value].value));
    allDatesFull.value = input.map(e => e._id.toString());
    return { data, labels }
}

const body = computed(() => {
    return {
        from: safeSnapshotDates.value.from,
        to: safeSnapshotDates.value.to,
        slice: selectLabels[selectedLabelIndex.value].value
    }
});


function onResponseError(e: any) {
    console.log('ON RESPONSE ERROR')
    errorData.value = { errored: true, text: e.response._data.message ?? 'Generic error' }
}

function onResponse(e: any) {
    console.log('ON RESPONSE')
    if (e.response.status != 500) errorData.value = { errored: false, text: '' }
}

const visitsData = useFetch(`/api/metrics/${activeProject.value?._id}/timeline/visits`, {
    method: 'POST', ...signHeaders({ v2: 'true' }), body, transform: transformResponse,
    lazy: true, immediate: false,
    onResponseError,
    onResponse
});

const eventsData = useFetch(`/api/metrics/${activeProject.value?._id}/timeline/events`, {
    method: 'POST', ...signHeaders({ v2: 'true' }), body, transform: transformResponse,
    lazy: true, immediate: false,
    onResponseError,
    onResponse
});

const sessionsData = useFetch(`/api/metrics/${activeProject.value?._id}/timeline/sessions`, {
    method: 'POST', ...signHeaders({ v2: 'true' }), body, transform: transformResponse,
    lazy: true, immediate: false,
    onResponseError,
    onResponse
});


const readyToDisplay = computed(() => {
    return !visitsData.pending.value && !eventsData.pending.value && !sessionsData.pending.value;
});

watch(readyToDisplay, () => {
    if (readyToDisplay.value === true) onDataReady();
})


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

function onDataReady() {
    console.log('DATA READY');

    if (!visitsData.data.value) return;
    if (!eventsData.data.value) return;
    if (!sessionsData.data.value) return;

    console.log('DATA READY 2');

    chartData.value.labels = visitsData.data.value.labels;

    const maxChartY = Math.max(...visitsData.data.value.data, ...sessionsData.data.value.data);
    const maxEventSize = Math.max(...eventsData.data.value.data)

    chartData.value.datasets[0].data = visitsData.data.value.data;
    chartData.value.datasets[1].data = sessionsData.data.value.data;
    chartData.value.datasets[2].data = eventsData.data.value.data.map(e => {
        const rValue = 25 / maxEventSize * e;
        return { x: 0, y: maxChartY + 70, r: isNaN(rValue) ? 0 : rValue, r2: e }
    });

    chartData.value.datasets[0].backgroundColor = [createGradient('#5655d7')];
    chartData.value.datasets[1].backgroundColor = [createGradient('#4abde8')];
    chartData.value.datasets[2].backgroundColor = [createGradient('#fbbf24')];

    console.log('UPDATE CHART');
    updateChart();

}

const currentTooltipData = ref<{ visits: number, events: number, sessions: number, date: string }>({
    visits: 0,
    events: 0,
    sessions: 0,
    date: ''
});

const tooltipNameIndex = ['visits', 'sessions', 'events'];

function onLegendChange(dataset: any, index: number, checked: any) {
    dataset.hidden = !checked;
}

const legendColors = [
    '#5655d7',
    '#4abde8',
    '#fbbf24'
]


onMounted(async () => {
    visitsData.execute();
    eventsData.execute();
    sessionsData.execute();
});


const inLiveDemo = isLiveDemo();

</script>

<template>
    <CardTitled title="Trend chart" sub="Easily match Visits, Unique sessions and Events trends." class="w-full">
        <template #header>
            <SelectButton class="w-fit" @changeIndex="selectedLabelIndex = $event" :currentIndex="selectedLabelIndex"
                :options="selectLabels">
            </SelectButton>
        </template>

        <div class="flex gap-6 w-full justify-between">
            <LyxUiButton type="secondary" :to="inLiveDemo ? '#' : '/analyst'" :disabled="inLiveDemo">
                <div class="flex items-center gap-2 px-10">
                    <i class="far fa-sparkles text-yellow-400"></i>
                    <div class="poppins text-lyx-text"> Ask AI </div>
                </div>
            </LyxUiButton>
            <div class="flex gap-6">
                <div v-for="(dataset, index) of chartData.datasets" class="flex gap-2 items-center text-[.9rem]">
                    <UCheckbox :ui="{
                        color: `text-[${legendColors[index]}]`
                    }" :model-value="true" @change="onLegendChange(dataset, index, $event)"></UCheckbox>
                    <label class="mt-[2px]"> {{ dataset.label }} </label>
                </div>
            </div>
        </div>



        <div id='external-tooltip' ref="externalTooltipElement" class="z-[400]">
            <LyxUiCard>
                <div class="flex gap-2 items-center">
                    <div> Date: </div>
                    <div v-if="currentTooltipData"> {{ currentTooltipData.date }}</div>
                </div>
                <div v-for="(dataset, index) of chartData.datasets" class="flex gap-2 items-center">
                    <div :style="`background-color: ${legendColors[index]}`" class="h-4 w-4 rounded-full">
                    </div>
                    <div> {{ dataset.label }}</div>
                    <div v-if="currentTooltipData" class="grow text-right px-4">
                        {{ (currentTooltipData as any)[tooltipNameIndex[index]] }}
                    </div>
                </div>
                <!-- <div class="bg-lyx-background-lighter h-[2px] w-full my-2"> </div> -->
            </LyxUiCard>
        </div>



        <div v-if="!readyToDisplay" class="flex justify-center py-40">
            <i class="fas fa-spinner text-[2rem] text-accent animate-[spin_1s_linear_infinite] duration-500"></i>
        </div>

        <div class="flex flex-col items-end" v-if="readyToDisplay && !errorData.errored">
            <LineChart ref="lineChartRef" class="w-full h-full" v-bind="lineChartProps"> </LineChart>
        </div>

        <div v-if="errorData.errored" class="flex items-center justify-center py-8">
            {{ errorData.text }}
        </div>

    </CardTitled>
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