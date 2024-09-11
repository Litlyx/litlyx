<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js';
import { useBarChart, BarChart } from 'vue-chart-3';
registerChartComponents();

const props = defineProps<{
    datasets: any[],
    labels: string[],
}>();

const chartOptions = ref<ChartOptions<'bar'>>({
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
            display: true,
            position: 'right',
        },
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


const chartData = ref<ChartData<'bar'>>({
    labels: props.labels,
    datasets: props.datasets.map(e => {
        return {
            data: e.data,
            label: e.label || '?',
            backgroundColor: [e.color],
            borderWidth: 0,
            borderRadius: 0
        }
    })
});


const { barChartProps, barChartRef } = useBarChart({ chartData: chartData, options: chartOptions });


onMounted(async () => {
    // const c = document.createElement('canvas');
    // const ctx = c.getContext("2d");
    // let gradient: any = `${props.color}22`;
    // if (ctx) {
    //     gradient = ctx.createLinearGradient(0, 25, 0, 300);
    //     gradient.addColorStop(0, `${props.color}99`);
    //     gradient.addColorStop(0.35, `${props.color}66`);
    //     gradient.addColorStop(1, `${props.color}22`);
    // } else {
    //     console.warn('Cannot get context for gradient');
    // }

    // chartData.value.datasets[0].backgroundColor = [gradient];

    watch(props, () => {
        console.log('UPDATE')
        chartData.value.labels = props.labels;
        chartData.value.datasets.length = 0;
        chartData.value.datasets = props.datasets.map(e => {
            return {
                data: e.data,
                label: e.label || '?',
                backgroundColor: [e.color],
                borderWidth: 0,
                borderRadius: 8
            }
        })
    });

});

</script>


<template>
    <BarChart v-bind="barChartProps"> </BarChart>
</template>
