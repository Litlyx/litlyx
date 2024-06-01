<script lang="ts" setup>

import type { DevicesAggregated } from '~/server/api/metrics/[project_id]/data/devices';

const activeProject = await useActiveProject();
const { data: events, pending, refresh } = await useFetch<DevicesAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/devices`, signHeaders());


const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {


    showDialog.value = true;
    dialogBarData.value = [];
    isDataLoading.value = true;

    $fetch<any[]>(`/api/metrics/${activeProject.value?._id}/data/devices`, signHeaders({
        'x-query-limit': '200'
    })).then(data => {
        dialogBarData.value = data;
        isDataLoading.value = false;
    });

}

</script>


<template>
    <div class="flex flex-col gap-2">
        <DashboardBarsCard @showMore="showMore()" @dataReload="refresh" :data="events || []" :dataIcons="false"
            desc="The devices most used to access your website." :loading="pending" label="Top Devices"
            sub-label="Devices"></DashboardBarsCard>
    </div>
</template>
