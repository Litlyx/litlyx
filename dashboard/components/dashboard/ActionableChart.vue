<script lang="ts" setup>
import DateService, { type Slice } from '@services/DateService';
import type { ChartData, ChartOptions, TooltipModel } from 'chart.js';
import { useLineChart, LineChart } from 'vue-chart-3';

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
            borderSkipped: ['bottom']
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

const externalTooltipElement = ref<null | HTMLDivElement>(null);

function externalTooltipHandler(context: { chart: any, tooltip: TooltipModel<'line' | 'bar'> }) {
    const { chart, tooltip } = context;
    const tooltipEl = externalTooltipElement.value;

    const currentIndex = tooltip.dataPoints[0].parsed.x;

    const todayIndex = visitsData.data.value?.todayIndex;
    if (todayIndex && todayIndex >= 0) {
        if (currentIndex > todayIndex - 1) {
            if (!tooltipEl) return;
            return tooltipEl.style.opacity = '0';
        }
    }


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

const { snapshotDuration } = useSnapshot();

const selectLabels: { label: string, value: Slice }[] = [
    { label: 'Hour', value: 'hour' },
    { label: 'Day', value: 'day' },
    { label: 'Month', value: 'month' },
];

const selectLabelsAvailable = computed<{ label: string, value: Slice, disabled: boolean }[]>(() => {
    return selectLabels.map(e => {
        return { ...e, disabled: !DateService.canUseSliceFromDays(snapshotDuration.value, e.value)[0] }
    });
})

const selectedSlice = computed<Slice>(() => {
    const targetValue = selectLabelsAvailable.value[selectedLabelIndex.value];
    if (!targetValue) return 'day';
    if (targetValue.disabled) {
        selectedLabelIndex.value = selectLabelsAvailable.value.findIndex(e => !e.disabled);
    }
    return selectLabelsAvailable.value[selectedLabelIndex.value].value
});

const selectedLabelIndex = ref<number>(1);
const allDatesFull = ref<string[]>([]);


function transformResponse(input: { _id: string, count: number }[]) {
    const data = input.map(e => e.count);
    const labels = input.map(e => DateService.getChartLabelFromISO(e._id, new Date().getTimezoneOffset(), selectedSlice.value));
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


const visitsData = useFetch('/api/timeline/visits', {
    headers: useComputedHeaders({ slice: selectedSlice }), lazy: true,
    transform: transformResponse, onResponseError, onResponse
});

const sessionsData = useFetch('/api/timeline/sessions', {
    headers: useComputedHeaders({ slice: selectedSlice }), lazy: true,
    transform: transformResponse, onResponseError, onResponse
});

const eventsData = useFetch('/api/timeline/events', {
    headers: useComputedHeaders({ slice: selectedSlice }), lazy: true,
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

const currentTooltipData = ref<{ visits: number, events: number, sessions: number, date: string }>({
    visits: 0,
    events: 0,
    sessions: 0,
    date: ''
});

const tooltipNameIndex = ['visits', 'sessions', 'events'];

function onLegendChange(dataset: any, index: number, checked: any) {
    const newValue = !checked;
    dataset.hidden = newValue;
}

const legendColors = ref<string[]>(['#5655d7', '#4abde8', '#fbbf24'])
const legendClasses = ref<string[]>([
    'actionable-visits-color-checkbox',
    'actionable-sessions-color-checkbox',
    'actionable-events-color-checkbox'
])


</script>

<template>
    <CardTitled title="Trend chart" sub="Easily match Visits, Unique sessions and Events trends." class="w-full">
        <template #header>
            <SelectButton class="w-fit" @changeIndex="selectedLabelIndex = $event" :currentIndex="selectedLabelIndex"
                :options="selectLabelsAvailable">
            </SelectButton>
        </template>

        <div class="flex gap-6 w-full justify-between lg:flex-row flex-col">
            <LyxUiButton type="secondary" :to="isLiveDemo ? '#' : '/analyst'" :disabled="isLiveDemo">
                <div class="flex items-center gap-2 px-10">
                    <i class="far fa-sparkles text-yellow-600 dark:text-yellow-400"></i>
                    <div class="poppins text-lyx-lightmode-text dark:text-lyx-text"> Ask AI </div>
                </div>
            </LyxUiButton>
            <div class="flex gap-6">
                <div v-for="(dataset, index) of chartData.datasets" class="flex gap-2 items-center text-[.9rem]">

                    <UCheckbox :ui="{
                        color: legendClasses[index]
                    }" :model-value="true" @change="onLegendChange(dataset, index, $event)"></UCheckbox>

                    <label class="mt-[2px]"> {{ dataset.label }} </label>
                </div>
            </div>
        </div>



        <div id='external-tooltip' ref="externalTooltipElement" class="z-[400]">
            <LyxUiCard class="text-lyx-lightmode-text dark:text-lyx-text">
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