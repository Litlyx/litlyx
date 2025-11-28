<script lang="ts" setup>
import type { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { useBarChart, BarChart } from 'vue-chart-3';
import { type Slice } from '~/shared/services/DateService';

export type EventsStackedChartData = {
    data: ({ name: string, count: number }[])[],
    labels: string[],
    slice: Slice,
    todayIndex: number,
    tooltipHandler?: any
}

const props = defineProps<{ data: EventsStackedChartData }>();

const chartOptions = shallowRef<ChartOptions<'bar'>>({
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
            stacked: true,
            ticks: { display: true },
            grid: {
                display: false,
                drawBorder: false,
                color: '#CCCCCC22',
            },
        },
        x: {
            stacked: true,
            ticks: { display: true },
            grid: {
                display: false,
                drawBorder: false,
                color: '#CCCCCC22',
            }
        }
    },
    plugins: {
        legend: {
            display: false,
        },
        title: { display: false },
        tooltip: {
            enabled: false,
            position: 'nearest',
            external: props.data.tooltipHandler
        },
    },
});

const chartData = ref<ChartData<'bar'>>(getChartData());

function getChartJsDataset() {
    const eventMap: Record<string, number[]> = {};

    props.data.data.forEach((dailyEvents, dayIndex) => {
        const nameCountMap: Record<string, number> = {};

        if (!dailyEvents) return;

        dailyEvents.forEach(event => {
            nameCountMap[event.name] = event.count;
        });

        for (const name in eventMap) {
            eventMap[name].push(nameCountMap[name] || 0);
        }

        for (const name in nameCountMap) {
            if (!eventMap[name]) {
                eventMap[name] = Array(dayIndex).fill(0);
            }
            eventMap[name].push(nameCountMap[name]);
        }
    });

    const datasets = Object.entries(eventMap).map(([name, data]) => ({ label: name, data }));

    return datasets;
}

const backgroundColors = getBackgroundColors();

function getBackgroundColors() {
    const backgroundColors = [
        "#5655d0",
        "#6bbbe3",
        "#a6d5cb",
        "#fae0b9",
        "#f28e8e",
        "#e3a7e4",
        "#c4a8e1",
        "#8cc1d8",
        "#f9c2cd",
        "#b4e3b2",
        "#ffdfba",
        "#e9c3b5",
        "#d5b8d6",
        "#add7f6",
        "#ffd1dc",
        "#ffe7a1",
        "#a8e6cf",
        "#d4a5a5",
        "#f3d6e4",
        "#c3aed6",
        "#5655d0",
        "#6bbbe3",
        "#a6d5cb",
        "#fae0b9",
        "#f28e8e",
        "#e3a7e4",
        "#c4a8e1",
        "#8cc1d8",
        "#f9c2cd",
        "#b4e3b2",
        "#ffdfba",
        "#e9c3b5",
        "#d5b8d6",
        "#add7f6",
        "#ffd1dc",
        "#ffe7a1",
        "#a8e6cf",
        "#d4a5a5",
        "#f3d6e4",
        "#c3aed6",
        "#5655d0",
        "#6bbbe3",
        "#a6d5cb",
        "#fae0b9",
        "#f28e8e",
        "#e3a7e4",
        "#c4a8e1",
        "#8cc1d8",
        "#f9c2cd",
        "#b4e3b2",
        "#ffdfba",
        "#e9c3b5",
        "#d5b8d6",
        "#add7f6",
        "#ffd1dc",
        "#ffe7a1",
        "#a8e6cf",
        "#d4a5a5",
        "#f3d6e4",
        "#c3aed6"
    ]

    return backgroundColors;
}

function getChartData(): ChartData<'bar'> {

    const backgroundColors = getBackgroundColors();

    return {
        labels: props.data.labels,
        datasets: getChartJsDataset().map((e, i) => {
            return {
                ...e,
                backgroundColor: backgroundColors[i],
                borderWidth: 0,
                borderRadius: 0,
            }
        })
        //  props.data.data.map(e => {
        //     return {
        //         data: e.map(e => e.count),
        //         label: 'CACCA',
        //         backgroundColor: ['#FF0000'],
        //         borderWidth: 0,
        //         borderRadius: 0
        //     }
        // })
    }
}

watch(props, () => {
    chartData.value = getChartData();
})

function toggleDataset(dataset: ChartDataset<'bar'>) {
    dataset.hidden = !dataset.hidden;
}

function disableAll() {
    for (const dataset of chartData.value.datasets) {
        dataset.hidden = true;
    }
}

function enableAll() {
    for (const dataset of chartData.value.datasets) {
        dataset.hidden = false;
    }
}

const { barChartProps, barChartRef } = useBarChart({ chartData: chartData as any, options: chartOptions });

</script>

<template>
    <div class="flex flex-col gap-3">
        <BarChart v-if="props.data.data.length > 0" class="w-full h-full" v-bind="barChartProps"> </BarChart>
        <div v-if="props.data.data.length > 0" class="flex flex-wrap gap-x-4 gap-y-2 mt-6">
            <div v-for="(dataset, index) of chartData.datasets" @click="toggleDataset(dataset as any)"
                :class="{ 'line-through': dataset.hidden }"
                class="flex items-center gap-2 border-solid border-[1px] px-3 py-[.3rem] rounded-lg hover:bg-accent cursor-pointer">
                <div :style="`background-color: ${backgroundColors[index]}`" class="size-3 rounded-lg"></div>
                <div>{{ dataset.label }}</div>
            </div>
            <Button @click="disableAll()"> Disable all </Button>
            <Button @click="enableAll()"> Enable all </Button>
        </div>
        <div class="font-medium" v-if="props.data.data.length == 0">
            No data yet
        </div>
    </div>
</template>