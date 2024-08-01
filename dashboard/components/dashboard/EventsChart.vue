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
            backgroundColor: ['#6bbbe3', '#5655d0', '#a6d5cb', '#fae0b9'],
            borderColor: ['#1d1d1f'],
            borderWidth: 2
        },
    ]
});


const { doughnutChartProps, doughnutChartRef } = useDoughnutChart({ chartData: chartData, options: chartOptions });


const res = useEventsData();

onMounted(async () => {

    res.onResponse(resData => {
        if (!resData.value) return;

        chartData.value.labels = resData.value.map(e => {
            return `${e._id}`;
        });

        chartData.value.datasets[0].data = resData.value.map(e => e.count);
        doughnutChartRef.value?.update();

        if (window.innerWidth < 800) {
            if (chartOptions.value?.plugins?.legend?.display) {
                chartOptions.value.plugins.legend.display = false;
            }
        }

    });
})


const chartVisible = computed(() => {
    if (res.pending.value) return false;
    if (!res.data.value) return false;
    return true;
})

</script>


<template>
    <div>
        <div v-if="!chartVisible" class="flex justify-center py-40">
            <i class="fas fa-spinner text-[2rem] text-accent animate-[spin_1s_linear_infinite] duration-500"></i>
        </div>
        <DoughnutChart v-if="chartVisible" v-bind="doughnutChartProps"> </DoughnutChart>
    </div>
</template>
