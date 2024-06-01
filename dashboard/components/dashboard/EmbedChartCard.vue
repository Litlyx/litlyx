<script lang="ts" setup>
import { Chart, registerables, type ChartData, type ChartOptions } from 'chart.js';
import { useLineChart, LineChart } from 'vue-chart-3';
if (process.client) Chart.register(...registerables);

const props = defineProps<{
    data: any[],
    labels: string[]
    color: string,
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
            borderWidth: 4,
            fill: true,
            tension: 0.45,
            pointRadius: 0
        },
    ],
});

const { lineChartProps, lineChartRef } = useLineChart({ chartData: chartData, options: chartOptions });

// onMounted(() => { })

</script>

<template>
    <LineChart class="max-h-full max-w-full w-full h-full" ref="lineChartRef" v-bind="lineChartProps"> </LineChart>
</template>
