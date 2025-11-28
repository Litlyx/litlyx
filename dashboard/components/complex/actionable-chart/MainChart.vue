<script lang="ts" setup>
import type { ChartData, ChartOptions, TooltipModel } from 'chart.js';
import { useLineChart, LineChart } from 'vue-chart-3';
import { type Slice } from '~/shared/services/DateService';

export type ActionableChartData = {
    labels: string[],
    visits: number[],
    sessions: number[],
    events: { x: number, y: number, r: number, r2: any }[],
    slice: Slice,
    todayIndex: number,
    tooltipHandler?: any,
    showViews?: boolean,
    showVisitors?: boolean,
    showEvents?: boolean
}

const props = defineProps<{ data: ActionableChartData }>();

const chartColor = useChartColor();

const chartOptions = shallowRef<ChartOptions<'line'>>({
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
            enabled: false,
            position: 'nearest',
            external: props.data.tooltipHandler
        }
    },
});

const chartData = shallowRef<ChartData<'line' | 'bar' | 'bubble'>>(getChartData());

function getChartData(): ChartData<'line' | 'bar' | 'bubble'> {

    return {
        labels: props.data.labels,
        datasets: [
            {
                label: 'Visits',
                data: props.data.visits,
                backgroundColor: [`${chartColor.visits}`],
                borderColor: `${chartColor.visits}`,
                borderWidth: 4,
                fill: true,
                tension: 0.35,
                pointRadius: 0,
                pointHoverRadius: 10,
                hoverBackgroundColor: `${chartColor.visits}`,
                hoverBorderColor: 'white',
                hoverBorderWidth: 2,
                hidden: props.data.showViews != true,
                segment: {
                    borderColor(ctx, options) {
                        const todayIndex = props.data.todayIndex;
                        if (!todayIndex || todayIndex == -1) return `${chartColor.visits}`;
                        if (ctx.p1DataIndex > todayIndex - 1) return `${chartColor.visits}00`;
                        return `${chartColor.visits}`
                    },
                    borderDash(ctx, options) {
                        const todayIndex = props.data.todayIndex;
                        if (!todayIndex || todayIndex == -1) return undefined;
                        if (ctx.p1DataIndex == todayIndex - 1) return [3, 5];
                        return undefined;
                    },
                    backgroundColor(ctx, options) {
                        const todayIndex = props.data.todayIndex;
                        if (!todayIndex || todayIndex == -1) return `${chartColor.visits}00`;
                        if (ctx.p1DataIndex >= todayIndex) return `${chartColor.visits}00`;
                        return `${chartColor.visits}00`;
                    },
                },
            },
            {
                label: 'Unique visitors',
                data: props.data.sessions,
                backgroundColor: props.data.sessions.map((e, i) => {
                    const todayIndex = props.data.todayIndex;
                    if (i == todayIndex - 1) return `${chartColor.sessions}22`;
                    return `${chartColor.sessions}00`;
                }),
                borderColor: `${chartColor.sessions}`,
                borderWidth: 2,
                hoverBackgroundColor: `${chartColor.sessions}22`,
                hoverBorderColor: `${chartColor.sessions}`,
                hoverBorderWidth: 2,
                  hidden: props.data.showVisitors != true,
                type: 'bar',
                // barThickness: 20,
                borderSkipped: props.data.sessions.map((e, i) => {
                    const todayIndex = props.data.todayIndex;
                    if (i == todayIndex - 1) return true;
                    return 'bottom';
                }),
            },
            {
                label: 'Events',
                data: props.data.events,
                backgroundColor: props.data.sessions.map((e, i) => {
                    const todayIndex = props.data.todayIndex;
                    if (i == todayIndex - 1) return `#fbbf2422`;
                    return `#fbbf2400`;
                }),
                borderWidth: 2,
                hoverBackgroundColor: '#fbbf2444',
                hoverBorderColor: '#fbbf24',
                hoverBorderWidth: 2,
                  hidden: props.data.showEvents != true,
                type: 'bubble',
                stack: 'combined',
                borderColor: ["#fbbf24"],
            }
        ],
    }
}

watch(props, () => {
    chartData.value = getChartData();
})


const { lineChartProps, lineChartRef, update: updateChart } = useLineChart({ chartData: (chartData as any), options: chartOptions });

</script>

<template>
    <LineChart v-if="chartData" ref="lineChartRef" class="w-full h-full" v-bind="lineChartProps"> </LineChart>
</template>