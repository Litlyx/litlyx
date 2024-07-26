<script lang="ts" setup>

import type { IconProvider } from './BarsCard.vue';
import ReferrerBarChart from '../referrer/ReferrerBarChart.vue';

const { data: events, pending, refresh } = useReferrersData(10);


function iconProvider(id: string): ReturnType<IconProvider> {
    if (id === 'self') return ['icon', 'fas fa-link'];
    return ['img', `https://s2.googleusercontent.com/s2/favicons?domain=${id}&sz=64`]
}

function elementTextTransformer(element: string) {
    if (element === 'self') return 'Direct Link';
    return element;
}


const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

const customDialog = useCustomDialog();

function onShowDetails(referrer: string) {
    customDialog.openDialog(ReferrerBarChart, { slice: 'day', referrer });
}




function showMore() {

    showDialog.value = true;
    dialogBarData.value = [];
    isDataLoading.value = true;


    const moreRes = useReferrersData(200);

    moreRes.onResponse(data => {
        dialogBarData.value = data.value?.map(e => {
            return { ...e, icon: iconProvider(e._id) }
        }) || [];
        isDataLoading.value = false;
    })

}

</script>


<template>
    <div class="flex flex-col gap-2">
        <DashboardBarsCard @showDetails="onShowDetails" @showMore="showMore()"
            :elementTextTransformer="elementTextTransformer" :iconProvider="iconProvider" @dataReload="refresh"
            :showLink=true :data="events || []" :interactive="true" desc="Where users find your website."
            :dataIcons="true" :loading="pending" label="Top Referrers" sub-label="Referrers"></DashboardBarsCard>
    </div>
</template>
