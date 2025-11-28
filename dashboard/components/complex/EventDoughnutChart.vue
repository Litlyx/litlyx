<script lang="ts" setup>

import { Chart, registerables, type ChartData, type ChartOptions } from 'chart.js';
import { LoaderCircle } from 'lucide-vue-next';
import { DoughnutChart, useDoughnutChart } from 'vue-chart-3';

const { data: events, status } = useAuthFetch<{ _id: string, count: number }[]>('/api/data/events', {
    headers: { 'x-limit': '5' }, lazy: true, key: 'doughnut:events'
});

watch(status, () => {
    if (status.value === 'success') {
        chartData.value = getChartData();
    }
})


const chartOptions = shallowRef<ChartOptions<'doughnut'>>({
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
    },
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            align: 'center',
            labels: {
                font: {
                    family: 'Poppins',
                    size: 14
                }
            }
        },
        title: {
            display: false
        },
    },
});

const chartData = shallowRef<ChartData<'doughnut'>>(getChartData());

function getChartData(): ChartData<'doughnut'> {

    const result: ChartData<'doughnut'> = {
        labels: events.value?.map(e => e._id) ?? [],
        datasets: [
            {
                rotation: 1,
                data: events.value?.map(e => e.count) ?? [],
                backgroundColor: [
                    "#5655d0",
                    "#6bbbe3",
                    "#a6d5cb",
                    "#fae0b9",
                    "#f28e8e",
                    "#e3a7e4",
                    "#c4a8e1",
                    "#8cc1d8",
                    "#f9c2cd",
                    "#b4e3b2",
                    "#ffdfba",
                    "#e9c3b5",
                    "#d5b8d6",
                    "#add7f6",
                    "#ffd1dc",
                    "#ffe7a1",
                    "#a8e6cf",
                    "#d4a5a5",
                    "#f3d6e4",
                    "#c3aed6"
                ],
                borderColor: ['#1d1d1f'],
                borderWidth: 2
            },
        ],
    }

    return result;
}


const { doughnutChartProps, doughnutChartRef } = useDoughnutChart({ chartData: chartData, options: chartOptions });


</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>
                Top 5 events
            </CardTitle>
            <CardDescription>
                Displays key events.
            </CardDescription>
        </CardHeader>
        <CardContent class="h-full">
            <div v-if="status !== 'success'" class="flex items-center justify-center h-full">
                <LoaderCircle class="size-10 animate-[spin_1s_ease-in-out_infinite] duration-500">
                </LoaderCircle>
            </div>
            <DoughnutChart v-if="status === 'success'" v-bind="doughnutChartProps"> </DoughnutChart>
        </CardContent>
    </Card>
</template>