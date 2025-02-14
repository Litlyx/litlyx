<script lang="ts" setup>



const { data: backendData, pending: backendPending, refresh: refreshBackend } = useFetch<any>(() => `/api/admin/backend`, signHeaders());

const avgDuration = computed(() => {
    if (!backendData?.value?.durations) return -1;
    return (backendData.value.durations.durations.reduce((a: any, e: any) => a + parseInt(e[1]), 0) / backendData.value.durations.durations.length);
})

const labels = new Array(650).fill('-');

const durationsDatasets = computed(() => {
    if (!backendData?.value?.durations) return [];

    const colors = ['#2200DD', '#CC0022', '#0022CC', '#FF0000', '#00FF00', '#0000FF'];

    const datasets = [];

    const uniqueConsumers: string[] = Array.from(new Set(backendData.value.durations.durations.map((e: any) => e[0])));

    for (let i = 0; i < uniqueConsumers.length; i++) {

        const consumerDurations = backendData.value.durations.durations.filter((e: any) => e[0] == uniqueConsumers[i]);

        datasets.push({
            points: consumerDurations.map((e: any) => {
                return 1000 /  parseInt(e[1])
            }),
            color: colors[i],
            chartType: 'line',
            name: uniqueConsumers[i]
        })
    }

    return datasets;

})

</script>

<template>
    <div class="mt-6 h-full">

        <div class="cursor-default flex justify-center w-full">

            <div v-if="backendData" class="flex flex-col mt-8 gap-6 px-20 items-center w-full">

                <div class="flex gap-8">
                    <div> Queue size: {{ backendData.queue?.size || 'ERROR' }} </div>
                    <div> Avg consumer time: {{ avgDuration.toFixed(1) }} ms </div>
                    <div> Avg processed/s: {{ (1000 / avgDuration).toFixed(1) }} </div>
                </div>

                <div class="w-full">
                    <AdminBackendLineChart :labels="labels" title="Avg Processed/s" :datasets="durationsDatasets">
                    </AdminBackendLineChart>
                </div>

                <div @click="refreshBackend()"> Refresh </div>
            </div>

            <div v-if="backendPending">
                Loading...
            </div>

        </div>
    </div>
</template>

<style scoped lang="scss"></style>