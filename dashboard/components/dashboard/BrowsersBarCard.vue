<script lang="ts" setup>

import type { BrowsersAggregated } from '~/server/api/metrics/[project_id]/data/browsers';

const activeProject = await useActiveProject();
const { data: events, pending, refresh } = await useFetch<BrowsersAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/browsers`, signHeaders());


const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {


    showDialog.value = true;
    dialogBarData.value = [];
    isDataLoading.value = true;

    $fetch<any[]>(`/api/metrics/${activeProject.value?._id}/data/browsers`, signHeaders({
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
            desc="The browsers most used to search your website." :dataIcons="false" :loading="pending"
            label="Top Browsers" sub-label="Browsers"></DashboardBarsCard>
    </div>
</template>
