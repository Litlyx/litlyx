<!-- <script lang="ts" setup>

import { Chart, registerables, type ChartData, type ChartOptions } from 'chart.js';
import { PieChart, usePieChart } from 'vue-chart-3';
import type { EventsPie } from '~/server/api/metrics/[project_id]/events_pie';

if (process.client) {
    Chart.register(...registerables);
}

const { project } = await useCurrentProject();

const { data: eventsPieData } = await useFetch<EventsPie[]>(`/api/metrics/${project.value?._id}/events_pie`, signHeaders());

const eventsTimelineOptions = ref<ChartOptions<'pie'>>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: 'Events',
            color: '#EEECF6',
        },
    },
});

const eventsTimelineData = computed<ChartData<'pie'>>(() => ({
    labels: (eventsPieData.value || []).map((e: EventsPie) => {
        return e._id;
    }),
    datasets: [
        {
            data: (eventsPieData.value || []).map((e: EventsPie) => {
                return e.count;
            }),
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

</template> -->
