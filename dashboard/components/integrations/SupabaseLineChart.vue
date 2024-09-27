<script setup lang="ts">
import type { TSupabaseIntegration } from '@schema/integrations/SupabaseIntegrationSchema';
import type { ChartData, ChartOptions } from 'chart.js';
import { useLineChart, LineChart } from 'vue-chart-3';

const props = defineProps<{ integration_id: string }>();

const activeProjectId = useActiveProjectId();

const supabaseData = ref<{ labels: string[], data: number[] }>();
const supabaseError = ref<string | undefined>(undefined);
const supabaseFetching = ref<boolean>(false);

const { getRemoteData } = useSupabase();

function createGradient() {

    const c = document.createElement('canvas');
    const ctx = c.getContext("2d");
    let gradient: any = `#34B67C22`;
    if (ctx) {
        gradient = ctx.createLinearGradient(0, 25, 0, 300);
        gradient.addColorStop(0, `#34B67C99`);
        gradient.addColorStop(0.35, `#34B67C66`);
        gradient.addColorStop(1, `#34B67C22`);
    } else {
        console.warn('Cannot get context for gradient');
    }

    chartData.value.datasets[0].backgroundColor = [gradient];
}



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
    labels: [],
    datasets: [
        {
            data: [],
            backgroundColor: ['#34B67C' + '77'],
            borderColor: '#34B67C',
            borderWidth: 4,
            fill: true,
            tension: 0.45,
            pointRadius: 0,
            pointHoverRadius: 10,
            hoverBackgroundColor: '#34B67C',
            hoverBorderColor: 'white',
            hoverBorderWidth: 2,
        },
    ],
});


onMounted(async () => {

supabaseFetching.value = true;
supabaseError.value = undefined;

const integrationData = await $fetch<TSupabaseIntegration>('/api/integrations/supabase/get', {
    ...signHeaders({
        'x-pid': activeProjectId.data.value || '',
        'x-integration': props.integration_id
    })
});

if (!integrationData) {
    supabaseError.value = 'Cannot get integration data';
    supabaseFetching.value = false;
    return;
}
try {
    const data = await getRemoteData(
        integrationData.table_name,
        integrationData.xField,
        integrationData.yMode,
        integrationData.from.toString(),
        integrationData.to.toString(),
        integrationData.slice,
    );
    if (data.error) {
        supabaseError.value = data.error;
        supabaseFetching.value = false;
        return;
    }
    supabaseFetching.value = false;
    supabaseData.value = data.result;

    chartData.value.labels = data.result?.labels || [];
    chartData.value.datasets[0].data = data.result?.data || [];

    console.log(data.result);
    createGradient();
} catch (ex: any) {
    if (!ex.response._data) {
        supabaseError.value = ex.message.toString();
        supabaseFetching.value = false;
    } else {
        supabaseError.value = ex.response._data.message.toString();
        supabaseFetching.value = false;
    }

}
});


const { lineChartProps, lineChartRef } = useLineChart({ chartData: chartData, options: chartOptions });


</script>


<template>
    <div v-if="!supabaseFetching">
        <div v-if="!supabaseError">
            <LineChart ref="lineChartRef" v-bind="lineChartProps"> </LineChart>
        </div>
        <div v-if="supabaseError"> {{ supabaseError }} </div>
    </div>
    <div v-if="supabaseFetching">
        Getting remote data...
    </div>
</template>
