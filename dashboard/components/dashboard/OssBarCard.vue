<script lang="ts" setup>

import type { OssAggregated } from '~/server/api/metrics/[project_id]/data/oss';

const activeProject = await useActiveProject();
const { data: events, pending, refresh } = await useFetch<OssAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/oss`, {
    ...signHeaders(),
    lazy: true
});


const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {


    showDialog.value = true;
    dialogBarData.value = [];
    isDataLoading.value = true;

    $fetch<any[]>(`/api/metrics/${activeProject.value?._id}/data/oss`, signHeaders({
        'x-query-limit': '200'
    })).then(data => {
        dialogBarData.value = data;
        isDataLoading.value = false;
    });

}

</script>


<template>
    <div class="flex flex-col gap-2">
        <DashboardBarsCard @showMore="showMore()" @dataReload="refresh" :data="events || []"
            desc="The operating systems most commonly used by your website's visitors." :dataIcons="false"
            :loading="pending" label="Top OS" sub-label="OSs"></DashboardBarsCard>
    </div>
</template>
