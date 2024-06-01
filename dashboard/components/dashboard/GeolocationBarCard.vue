<script lang="ts" setup>

import type { CountriesAggregated } from '~/server/api/metrics/[project_id]/data/countries';

const activeProject = await useActiveProject();
const { data: countries, pending, refresh } = await useFetch<CountriesAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/countries`, signHeaders());


const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {


    showDialog.value = true;
    dialogBarData.value = [];
    isDataLoading.value = true;

    $fetch<any[]>(`/api/metrics/${activeProject.value?._id}/data/countries`, signHeaders({
        'x-query-limit': '200'
    })).then(data => {
        dialogBarData.value = data;
        isDataLoading.value = false;
    });

}

</script>


<template>
    <div class="flex flex-col gap-2">
        <DashboardBarsCard @showMore="showMore()" @dataReload="refresh" :data="countries || []" :dataIcons="false" :loading="pending"
            label="Top Countries" sub-label="Countries" desc=" Lists the countries where users access your website."></DashboardBarsCard>
    </div>
</template>
