<script lang="ts" setup>
import { type ChartData, type ChartOptions } from 'chart.js';
import { useLineChart, LineChart } from 'vue-chart-3';

const props = defineProps<{
    data: any[],
    labels: string[],
    color: string,
    todayIndex: number
}>();


const chartOptions = shallowRef<ChartOptions<'line'>>({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        intersect: false,
    },
    elements: {
        point: {
            radius: 0,
            hoverRadius: 0
        }
    },
    scales: {
        y: {
            ticks: { display: false },
            grid: { display: false }
        },
        x: {
            ticks: { display: false },
            grid: { display: false }
        }
    },
    plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: { enabled: false },
        subtitle: { display: false },
        decimation: { enabled: false },
    },
    layout: {
        padding: {
            top: 6,
            bottom: -8,
            left: -8,
            right: -8
        },
        autoPadding: false
    },
});

const chartData = shallowRef<ChartData<'line'>>(getChartData());


function getChartData(): ChartData<'line'> {
    return {
        labels: props.labels,
        datasets: [
            {
                data: props.data,
                backgroundColor: [props.color + '77'],
                borderColor: props.color,
                borderWidth: 2,
                fill: false,
                tension: 0.35,
                pointRadius: 0,
                segment: {
                    borderColor(ctx, options) {
                        if (!props.todayIndex || props.todayIndex == -1) return props.color;
                        if (ctx.p1DataIndex >= props.todayIndex) return props.color + '00';
                        return props.color;
                    },
                    borderDash(ctx, options) {
                        if (!props.todayIndex || props.todayIndex == -1) return undefined;
                        if (ctx.p1DataIndex == props.todayIndex - 1) return [2, 4];
                        return undefined;
                    },
                },
            },
        ],
    }
}

watch(props, () => {
    chartData.value = getChartData();
})

const { lineChartProps, lineChartRef } = useLineChart({ chartData: chartData, options: chartOptions });


</script>

<template>
    <LineChart class="max-h-full max-w-full w-full h-full" ref="lineChartRef" v-bind="lineChartProps"> </LineChart>
</template>
