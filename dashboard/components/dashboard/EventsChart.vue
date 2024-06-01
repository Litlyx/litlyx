<script setup lang="ts">

import { Chart, registerables, type ChartData, type ChartOptions } from 'chart.js';
import { DoughnutChart, useDoughnutChart } from 'vue-chart-3';
import type { EventsPie } from '~/server/api/metrics/[project_id]/events_pie';

definePageMeta({ layout: 'dashboard' });

if (process.client) Chart.register(...registerables);

const chartOptions = ref<ChartOptions<'doughnut'>>({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            ticks: { display: false },
            grid: { display: false, drawBorder: false },
        },
        x: {
            ticks: { display: false },
            grid: { display: false, drawBorder: false },
        },
        // r: {
        //     ticks: { display: false },
        //     grid: {
        //         display: true,
        //         drawBorder: false,
        //         color: '#CCCCCC22',
        //         borderDash: [20, 8]
        //     },
        // }
    },
    plugins: {
        legend: {
            display: true,
            position: 'top',
            align: 'center',
            labels: {
                color: 'white',
                font: {
                    family: 'Poppins',
                    size: 16
                }
            }
        },
        title: {
            display: false
        },
    },
});

const chartData = ref<ChartData<'doughnut'>>({
    labels: [],
    datasets: [
        {
            rotation: 1,
            data: [],
            backgroundColor: ['#6bbbe3','#5655d0', '#a6d5cb', '#fae0b9'],
            borderColor: ['#1d1d1f'],
            borderWidth: 2
        },
    ]
});


const { doughnutChartProps, doughnutChartRef } = useDoughnutChart({ chartData: chartData, options: chartOptions });

onMounted(async () => {

    const activeProject = useActiveProject()

    const eventsData = await $fetch<EventsPie[]>(`/api/metrics/${activeProject.value?._id}/visits/events`, signHeaders());
    chartData.value.labels = eventsData.map(e => {
        return `${e._id}`;
    });
    chartData.value.datasets[0].data = eventsData.map(e => e.count);
    doughnutChartRef.value?.update();

    if (window.innerWidth < 800) {
        if (chartOptions.value?.plugins?.legend?.display) {
            chartOptions.value.plugins.legend.display = false;
        }
    }
})

</script>


<template>
    <DoughnutChart v-bind="doughnutChartProps"> </DoughnutChart>
</template>
