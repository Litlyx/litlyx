<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js';
import { useLineChart, LineChart } from 'vue-chart-3';
import * as datefns from 'date-fns';

registerChartComponents();

const errored = ref<boolean>(false);

const props = defineProps<{
    labels: string[],
    title: string,
    datasets: {
        points: number[],
        color: string,
        chartType: string,
        name: string
    }[]
}>();

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
        },
        x: {
            ticks: { display: true },
            grid: {
                display: true,
                drawBorder: false,
                color: '#CCCCCC22',
            }
        }
    },
    plugins: {
        legend: { display: true },
        title: {
            display: true,
            text: props.title
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: { size: 16, weight: 'bold' },
            bodyFont: { size: 14 },
            padding: 10,
            cornerRadius: 4,
            boxPadding: 10,
            caretPadding: 20,
            yAlign: 'bottom',
            xAlign: 'center',
        }
    },
});

const chartData = ref<ChartData<'line'>>({
    labels: props.labels.map(e => {
        try {
            return datefns.format(new Date(e), 'dd/MM');
        } catch (ex) {
            return e;
        }
    }),
    datasets: props.datasets.map(e => ({
        data: e.points,
        label: e.name,
        backgroundColor: [e.color + '77'],
        borderColor: e.color,
        borderWidth: 4,
        fill: true,
        tension: 0.45,
        pointRadius: 0,
        pointHoverRadius: 10,
        hoverBackgroundColor: e.color,
        hoverBorderColor: 'white',
        hoverBorderWidth: 2,
        type: e.chartType
    } as any))
});


const { lineChartProps, lineChartRef } = useLineChart({ chartData: chartData, options: chartOptions });

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

onMounted(async () => {
    try {
        chartData.value.datasets.forEach(dataset => {
            if (dataset.borderColor && dataset.borderColor.toString().startsWith('#')) {
                dataset.backgroundColor = [createGradient(dataset.borderColor as string)]
            } else {
                dataset.backgroundColor = [createGradient('#3d59a4')]
            }
        });
    } catch (ex) {
        errored.value = true;
        console.error(ex);
    }

});

</script>


<template>
    <div>
        <div v-if="errored"> ERROR CREATING CHART </div>
        <LineChart v-if="!errored" ref="lineChartRef" v-bind="lineChartProps"> </LineChart>
    </div>
</template>
