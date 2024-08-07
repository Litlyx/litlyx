<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js';
import { useLineChart, LineChart } from 'vue-chart-3';
registerChartComponents();

const props = defineProps<{
    data: any[],
    labels: string[]
    color: string,
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
        legend: { display: false },
        title: { display: false },
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
    labels: props.labels,
    datasets: [
        {
            data: props.data,
            backgroundColor: [props.color + '77'],
            borderColor: props.color,
            borderWidth: 4,
            fill: true,
            tension: 0.45,
            pointRadius: 0,
            pointHoverRadius: 10,
            hoverBackgroundColor: props.color,
            hoverBorderColor: 'white',
            hoverBorderWidth: 2,
        },
    ],
});


const { lineChartProps, lineChartRef } = useLineChart({ chartData: chartData, options: chartOptions });


onMounted(async () => {

    const c = document.createElement('canvas');
    const ctx = c.getContext("2d");
    let gradient: any = `${props.color}22`;
    if (ctx) {
        gradient = ctx.createLinearGradient(0, 25, 0, 300);
        gradient.addColorStop(0, `${props.color}99`);
        gradient.addColorStop(0.35, `${props.color}66`);
        gradient.addColorStop(1, `${props.color}22`);
    } else {
        console.warn('Cannot get context for gradient');
    }

    chartData.value.datasets[0].backgroundColor = [gradient];

    watch(props, () => {
        chartData.value.labels = props.labels;
        chartData.value.datasets[0].data = props.data;
    });

});

</script>


<template>
        <LineChart ref="lineChartRef" v-bind="lineChartProps"> </LineChart>
</template>
