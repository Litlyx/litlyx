<script lang="ts" setup>

import type { CountriesAggregated } from '~/server/api/metrics/[project_id]/data/countries';
import type { IconProvider } from './BarsCard.vue';

const activeProject = await useActiveProject();
const { data: countries, pending, refresh } = await useFetch<CountriesAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/countries`, signHeaders());

function iconProvider(id: string): ReturnType<IconProvider> {
    if (id === 'self') return ['icon', 'fas fa-link'];
    return [
        'img',
        `https://raw.githubusercontent.com/hampusborgos/country-flags/main/png250px/${id.toLowerCase()}.png`
    ]
}

const customIconStyle = `width: 2rem; padding: 1px;`

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
        <DashboardBarsCard @showMore="showMore()" @dataReload="refresh" :data="countries || []" :dataIcons="false"
            :loading="pending" label="Top Countries" sub-label="Countries" :iconProvider="iconProvider"
            :customIconStyle="customIconStyle" desc=" Lists the countries where users access your website.">
        </DashboardBarsCard>
    </div>
</template>
