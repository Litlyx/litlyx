<script lang="ts" setup>
import DateService, { type Slice } from '~/shared/services/DateService';
import ChartCard from './events-stacked-chart/ChartCard.vue';
import MainChart from './events-stacked-chart/MainChart.vue';
import { LoaderCircle } from 'lucide-vue-next';
import type { EventsStackedChartData } from './events-stacked-chart/MainChart.vue';
import type { TooltipModel } from 'chart.js';
import type { TooltipDataEventsStacked } from './events-stacked-chart/ChartTooltip.vue';
import ChartTooltip from './events-stacked-chart/ChartTooltip.vue';

const snapshotStore = useSnapshotStore();

const slices: Slice[] = ['hour', 'day', 'month'];

const allowedSlices = computed(() => {
    const days = snapshotStore.duration;
    return slices.filter(e => days > DateService.sliceAvailabilityMap[e][0] && days < DateService.sliceAvailabilityMap[e][1]);
});

const currentSlice = ref<Slice>(allowedSlices.value[0]);

watch(snapshotStore, () => {
    currentSlice.value = allowedSlices.value[0];
})

type ResultType = { _id: string, events: { name: string, count: number }[] }

const { data: events, status: eventsStatus, error: eventsError } = useAuthFetch<ResultType[]>('/api/timeline/events_stacked', {
    headers: { 'x-slice': currentSlice }, lazy: true
});

const todayIndex = computed(() => {
    if (!events.value) return -1;
    const index = events.value.findIndex(e => new Date(e._id).getTime() >= (Date.now()));
    return index;
});

const data = computed(() => {
    if (!events.value) return {
        data: [],
        labels: [],
        slice: 'month',
        todayIndex: todayIndex.value
    } as EventsStackedChartData;

    const result: EventsStackedChartData = {
        labels: events.value.map(e => DateService.getChartLabelFromISO(new Date(e._id).getTime(), currentSlice.value)),
        data: events.value.map(e => e.events),
        slice: currentSlice.value,
        todayIndex: todayIndex.value,
        tooltipHandler: externalTooltipHandler
    }

    return result;

})

const tooltipElement = ref<HTMLDivElement>();


const tooltipData = ref<TooltipDataEventsStacked>({
    date: '',
    items: []
});

function externalTooltipHandler(context: { chart: any, tooltip: TooltipModel<'line' | 'bar'> }) {
    const { chart, tooltip } = context;

    if (!tooltipElement.value) {
        const elem = document.getElementById('external-tooltip-events-stacked');
        if (!elem) return;
        tooltipElement.value = elem as HTMLDivElement;
    }

    const tooltipEl = tooltipElement.value;
    if (!tooltipEl) return;

    const currentIndex = tooltip.dataPoints[0].parsed.x;

    if (todayIndex.value >= 0) {
        if (currentIndex > todayIndex.value - 1) {
            return tooltipEl.style.opacity = '0';
        }
    }

    // tooltipData.value.visits = (tooltip.dataPoints.find(e => e.datasetIndex == 0)?.raw) as number;
    // tooltipData.value.sessions = (tooltip.dataPoints.find(e => e.datasetIndex == 1)?.raw) as number;
    // tooltipData.value.events = ((tooltip.dataPoints.find(e => e.datasetIndex == 2)?.raw) as any).r2.count as number;

    const result = tooltip.dataPoints.map(e => {
        return { label: e.dataset.label, value: e.raw as number, color: e.dataset.backgroundColor }
    }).filter(e => e.value > 0);

    tooltipData.value.items = result;

    const dateIndex = tooltip.dataPoints[0].dataIndex;
    const targetLabel = events.value ? events.value[dateIndex] : { _id: 0 };
    tooltipData.value.date = new Date(targetLabel._id).toLocaleString();

    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = '0';
        return;
    }

    const xSwap = tooltip.caretX > (window.innerWidth * 0.5) ? -250 : 50;

    tooltipEl.style.opacity = '1';

    tooltipEl.style.left = (tooltip.caretX + xSwap) + 'px';

    tooltipEl.style.top = (tooltip.caretY - 75) + 'px';
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';

}

</script>

<template>
    <ChartCard v-model="currentSlice">
        <div class="min-h-[25rem] flex items-center justify-center relative">
            <LoaderCircle v-if="eventsStatus !== 'success' && eventsStatus !== 'error'"
                class="size-10 animate-[spin_1s_ease-in-out_infinite] duration-500">
            </LoaderCircle>
            <MainChart class="w-full" v-if="eventsStatus === 'success'" :data="data"></MainChart>
            <ChartTooltip class="opacity-0" :data="tooltipData" id='external-tooltip-events-stacked'>
            </ChartTooltip>
            <div v-if="eventsError">
                {{ eventsError.data.message ?? eventsError }}
            </div>
        </div>
    </ChartCard>
</template>