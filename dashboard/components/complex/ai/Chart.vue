<script lang="ts" setup>
import type { ChartData, ChartOptions } from 'chart.js';
import { useLineChart, LineChart } from 'vue-chart-3';

export type AiChartData = {
    labels: string[],
    title: string,
    datasets: {
        chartType: 'line' | 'bar',
        points: number[],
        color: string,
        name: string
    }[]
}

const props = defineProps<{ data: AiChartData }>();

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
        title: { display: false }
    },
});

const chartData = shallowRef<ChartData<'line' | 'bar'>>({
    labels: props.data.labels,
    datasets: props.data.datasets.map(e => {
        return {
            label: e.name,
            data: e.points,
            borderColor: e.color ?? '#0000CC',
            type: e.chartType,
            backgroundColor: [e.color ?? '#0000CC']
        }
    })
});


const { lineChartProps, lineChartRef, update: updateChart } = useLineChart({ chartData: (chartData as any), options: chartOptions });

</script>

<template>
    <LineChart v-if="chartData" ref="lineChartRef" class="w-full h-full" v-bind="lineChartProps"> </LineChart>
</template>