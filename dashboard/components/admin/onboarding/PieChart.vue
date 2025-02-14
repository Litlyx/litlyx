<script lang="ts" setup>

import { type ChartData, type ChartOptions } from 'chart.js';
import { PieChart, usePieChart } from 'vue-chart-3';

const props = defineProps<{ data: { _id: string, count: number }[], title:string }>();

const eventsTimelineOptions = ref<ChartOptions<'pie'>>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: props.title,
            color: '#EEECF6',
        },
    },
});

const eventsTimelineData = computed<ChartData<'pie'>>(() => ({
    labels: props.data.map(e => e._id),
    datasets: [
        {
            data: props.data.map(e => e.count),
            backgroundColor: [
                "#295270",
                "#304F71",
                "#374C72",
                "#3E4A73",
                "#444773",
                "#4B4474",
                "#524175",
            ],
            borderColor: '#222222'
        },
    ],
}));


const { pieChartProps } = usePieChart({ chartData: eventsTimelineData, options: eventsTimelineOptions });


</script>



<template>

    <div>


        <div class="graph">
            <PieChart v-bind="pieChartProps">
            </PieChart>
        </div>

    </div>

</template>
