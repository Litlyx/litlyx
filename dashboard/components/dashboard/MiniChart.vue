<script setup lang="ts">

import { Chart, registerables, type ChartData, type ChartOptions } from 'chart.js';
import { useLineChart, LineChart } from 'vue-chart-3';

definePageMeta({ layout: 'dashboard' });

if (process.client) Chart.register(...registerables);

type Props = { xs?: any[], ys?: any[], color: string, border: string }

const props = defineProps<Props>();

const chartOptions = ref<ChartOptions<'line'>>({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            ticks: { display: false },
            grid: { display: false, drawBorder: false },
        },
        x: {
            ticks: { display: false },
            grid: { display: false, drawBorder: false }
        }
    },
    plugins: {
        legend: { display: false },
        title: { display: false },
    },
});

const chartData = computed<ChartData<'line'>>(() => ({
    labels: (props.xs || []),
    datasets: [
        {
            data: (props.ys || []),
            backgroundColor: [props.color],
            borderColor: props.border,
            borderWidth: 3,
            fill: true,
            pointRadius: 0,
            lineTension: 0.3,
        },
    ],
}));


const { lineChartProps } = useLineChart({ chartData: chartData, options: chartOptions });



</script>


<template>
    <LineChart v-bind="lineChartProps"> </LineChart>
</template>
