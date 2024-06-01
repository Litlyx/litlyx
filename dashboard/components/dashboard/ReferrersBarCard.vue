<script lang="ts" setup>

import type { ReferrersAggregated } from '~/server/api/metrics/[project_id]/data/referrers';
import type { IconProvider } from './BarsCard.vue';

const activeProject = await useActiveProject();
const { data: events, pending, refresh } = await useFetch<ReferrersAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/referrers`, signHeaders());


function iconProvider(id: string): ReturnType<IconProvider> {
    if (id === 'self') return ['icon', 'fas fa-link'];
    return ['img', `https://s2.googleusercontent.com/s2/favicons?domain=${id}&sz=64`]
}

function elementTextTransformer(element: string) {
    if (element === 'self') return 'Direct Link';
    return element;
}


const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {


    showDialog.value = true;
    dialogBarData.value = [];
    isDataLoading.value = true;

    $fetch<any[]>(`/api/metrics/${activeProject.value?._id}/data/referrers`, signHeaders({
        'x-query-limit': '200'
    })).then(data => {
        dialogBarData.value = data.map(e => {
            return { ...e, icon: iconProvider(e._id) }
        });
        isDataLoading.value = false;
    });

}

</script>


<template>
    <div class="flex flex-col gap-2">
        <DashboardBarsCard @showMore="showMore()" :elementTextTransformer="elementTextTransformer"
            :iconProvider="iconProvider" @dataReload="refresh" :data="events || []"
            desc="Where users find your website." :dataIcons="true" :loading="pending" label="Top Referrers"
            sub-label="Referrers"></DashboardBarsCard>
    </div>
</template>
