<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js';
import { defineChartComponent } from 'vue-chart-3';

const FunnelChart = defineChartComponent('funnel', 'funnel');

const chartOptions = ref<ChartOptions<'funnel'>>({
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


const chartData = ref<ChartData<'funnel'>>({
    labels: [],
    datasets: [
        {
            data: [],
            backgroundColor: ['#5680F8' + '77'],
            // borderColor: '#0000CC',
            // borderWidth: 4,
            fill: true,
            tension: 0.45,
            pointRadius: 0,
            pointHoverRadius: 10,
            hoverBackgroundColor: '#5680F8',
            // hoverBorderColor: 'white',
            // hoverBorderWidth: 2,
        },
    ],
});


onMounted(async () => {

    // const c = document.createElement('canvas');
    // const ctx = c.getContext("2d");
    // let gradient: any = `${'#0000CC'}22`;
    // if (ctx) {
    //     gradient = ctx.createLinearGradient(0, 25, 0, 300);
    //     gradient.addColorStop(0, `${'#0000CC'}99`);
    //     gradient.addColorStop(0.35, `${'#0000CC'}66`);
    //     gradient.addColorStop(1, `${'#0000CC'}22`);
    // } else {
    //     console.warn('Cannot get context for gradient');
    // }

    // chartData.value.datasets[0].backgroundColor = [gradient];

});

const eventsCount = await useFetch<{ _id: string, count: number }[]>(`/api/data/query`, {
    lazy: true, headers: useComputedHeaders({
        limit: 1000,
        custom: {
            'schema': 'events'
        }
    })
});


const enabledEvents = ref<string[]>([]);

async function onEventCheck(eventName: string) {
    const index = enabledEvents.value.indexOf(eventName);
    if (index == -1) {
        enabledEvents.value.push(eventName);
    } else {
        enabledEvents.value.splice(index, 1);
    }


    chartData.value.labels = enabledEvents.value;
    chartData.value.datasets[0].data = [];

    for (const enabledEvent of enabledEvents.value) {
        const target = (eventsCount.data.value ?? []).find(e => e._id == enabledEvent);
        chartData.value.datasets[0].data.push(target?.count || 0);
    }
}

</script>


<template>
    <CardTitled title="Funnel" sub="Funnel events">
        <div class="flex gap-2 justify-between">
            <div>
                <div class="min-w-[20rem]">
                    Select two or more events
                </div>
                <div v-for="event of eventsCount.data.value">
                    <UCheckbox @change="onEventCheck(event._id)" :value="enabledEvents.includes(event._id)"
                        :label="event._id">
                    </UCheckbox>
                </div>
            </div>
            <div class="grow">
                <FunnelChart :chart-data="chartData" :options="chartOptions"> </FunnelChart>
            </div>
        </div>
    </CardTitled>
</template>
