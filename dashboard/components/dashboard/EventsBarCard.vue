<script lang="ts" setup>

import type { CustomEventsAggregated } from '~/server/api/metrics/[project_id]/visits/events';

const activeProject = await useActiveProject();
const { data: events, pending, refresh } = await useFetch<CustomEventsAggregated[]>(`/api/metrics/${activeProject.value?._id}/visits/events`, signHeaders());

const router = useRouter();

function goToView() {
    router.push('/dashboard/events');
}

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {


    showDialog.value = true;
    dialogBarData.value = [];
    isDataLoading.value = true;

    $fetch<any[]>(`/api/metrics/${activeProject.value?._id}/visits/events`, signHeaders({
        'x-query-limit': '200'
    })).then(data => {
        dialogBarData.value = data;
        isDataLoading.value = false;
    });

}


</script>


<template>
    <div class="flex flex-col gap-2 h-full">
        <DashboardBarsCard  @showMore="showMore()" @showRawData="goToView()" desc="Most frequent user events triggered in this project" @dataReload="refresh" :data="events || []" :loading="pending" label="Top Events"
            sub-label="Events" :rawButton="!isLiveDemo()"></DashboardBarsCard>
    </div>
</template>
