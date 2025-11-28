<script lang="ts" setup>
import DateService, { type Slice } from '~/shared/services/DateService';
import ChartCard from './actionable-chart/ChartCard.vue';
import ChartTooltip, { type TooltipData } from './actionable-chart/ChartTooltip.vue';
import MainChart, { type ActionableChartData } from './actionable-chart/MainChart.vue';
import { LoaderCircle, Sparkles } from 'lucide-vue-next';
import type { TooltipModel } from 'chart.js';

const snapshotStore = useSnapshotStore();

const slices: Slice[] = ['hour', 'day', 'month'];

const { isShared, sharedSlice } = useShared();

const showViews = ref<boolean>(true);
const showVisitors = ref<boolean>(true);
const showEvents = ref<boolean>(true);

const allowedSlices = computed(() => {
    const days = snapshotStore.duration;
    return slices.filter(e => days > DateService.sliceAvailabilityMap[e][0] && days < DateService.sliceAvailabilityMap[e][1]);
});

const currentSlice = ref<Slice>(allowedSlices.value[0]);

watch(snapshotStore, () => {
    currentSlice.value = allowedSlices.value[0];
})

type ResultType = { _id: string, count: number }

const { data: visits, status: visitsStatus } = useAuthFetch<ResultType[]>('/api/timeline/visits', {
    headers: { 'x-slice': currentSlice }, lazy: true, key: 'actionable:visits'
});

const { data: sessions, status: sessionsStatus } = useAuthFetch<ResultType[]>('/api/timeline/sessions', {
    headers: { 'x-slice': currentSlice }, lazy: true, key: 'actionable:sessions'
});


const { data: events, status: eventsStatus } = useAuthFetch<ResultType[]>('/api/timeline/events', {
    headers: { 'x-slice': currentSlice }, lazy: true, key: 'actionable:events'
});

const ready = computed(() => {
    return visitsStatus.value === 'success' && sessionsStatus.value === 'success' && eventsStatus.value === 'success';
});

const todayIndex = computed(() => {
    if (!visits.value) return -1;
    const index = visits.value.findIndex(e => new Date(e._id).getTime() >= (Date.now()));
    return index;
});

const data = computed(() => {
    if (!visits.value || !sessions.value || !events.value) return {
        labels: [],
        visits: [], sessions: [], events: [],
        todayIndex: todayIndex.value,
        slice: 'month'
    } as ActionableChartData;

    const maxChartY = Math.max(...visits.value.map(e => e.count), ...sessions.value.map(e => e.count));
    const maxEventSize = Math.max(...events.value.map(e => e.count));

    const result: ActionableChartData = {
        labels: visits.value.map(e => DateService.getChartLabelFromISO(new Date(e._id).getTime(), isShared.value ? sharedSlice.value : currentSlice.value)),
        visits: visits.value.map(e => e.count),
        sessions: sessions.value.map(e => Math.round(e.count)),
        events: events.value.map(e => {
            const rValue = 20 / maxEventSize * e.count;
            return { x: 0, y: maxChartY + 60, r: isNaN(rValue) ? 0 : rValue, r2: e }
        }),
        todayIndex: todayIndex.value,
        slice: currentSlice.value,
        tooltipHandler: externalTooltipHandler,
        showViews: showViews.value,
        showVisitors: showVisitors.value,
        showEvents: showEvents.value,
    }

    return result;

})

const tooltipElement = ref<HTMLDivElement>();


const tooltipData = ref<TooltipData>({
    date: '',
    events: 0,
    sessions: 0,
    visits: 0
});

function externalTooltipHandler(context: { chart: any, tooltip: TooltipModel<'line' | 'bar'> }) {
    const { chart, tooltip } = context;

    if (!tooltipElement.value) {
        const elem = document.getElementById('external-tooltip');
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

    tooltipData.value.visits = (tooltip.dataPoints.find(e => e.datasetIndex == 0)?.raw) as number;
    tooltipData.value.sessions = (tooltip.dataPoints.find(e => e.datasetIndex == 1)?.raw) as number;
    tooltipData.value.events = ((tooltip.dataPoints.find(e => e.datasetIndex == 2)?.raw) as any)?.r2.count as number;

    const dateIndex = tooltip.dataPoints[0].dataIndex;
    const targetLabel = visits.value ? visits.value[dateIndex] : { _id: 0 };

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

const chartColor = useChartColor();


</script>

<template>
    <ChartCard v-model="currentSlice">
        <div class="flex flex-col">
            <div v-if="!isShared" class="mb-4 flex justify-between">
                <NuxtLink v-if="!isSelfhosted()" to="/ai">
                    <Button size="sm" variant="outline">
                        <Sparkles class="text-yellow-500" /> Ask AI
                    </Button>
                </NuxtLink>
                <div class="flex gap-4">

                    <div class="flex items-center gap-2">
                        <Checkbox v-model="showViews"></Checkbox>
                        <Label> Views </Label>
                    </div>
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="showVisitors">
                        </Checkbox>
                        <Label> Visitors </Label>
                    </div>
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="showEvents"></Checkbox>
                        <Label> Events </Label>
                    </div>
                </div>
            </div>
            <div class="h-[25rem] flex items-center justify-center relative">
                <LoaderCircle v-if="!ready" class="size-10 animate-[spin_1s_ease-in-out_infinite] duration-500">
                </LoaderCircle>
                <MainChart v-if="ready" :data="data"></MainChart>
                <ChartTooltip class="opacity-0" :data="tooltipData" id='external-tooltip'>
                </ChartTooltip>
            </div>
        </div>
    </ChartCard>
</template>