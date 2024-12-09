<script lang="ts" setup>
import { Chart, registerables, type ChartData, type ChartOptions } from 'chart.js';
import { useLineChart, LineChart } from 'vue-chart-3';
if (process.client) Chart.register(...registerables);

const props = defineProps<{
    data: any[],
    labels: string[]
    color: string,
    todayIndex: number
}>();


const chartOptions = ref<ChartOptions<'line'>>({
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 0,
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

const chartData = ref<ChartData<'line'>>({
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
                    if (ctx.p1DataIndex == props.todayIndex -1) return [2, 4];
                    return undefined;
                },
            },
        },
    ],
});

const { lineChartProps, lineChartRef } = useLineChart({ chartData: chartData, options: chartOptions });

// onMounted(() => { })

</script>

<template>
    <LineChart class="max-h-full max-w-full w-full h-full" ref="lineChartRef" v-bind="lineChartProps"> </LineChart>
</template>
