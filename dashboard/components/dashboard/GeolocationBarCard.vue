<script lang="ts" setup>

import type { IconProvider } from './BarsCard.vue';

const { data: countries, pending, refresh } = useGeolocationData(10);

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

    const moreRes = useGeolocationData(200);

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
        <DashboardBarsCard @showMore="showMore()" @dataReload="refresh" :data="countries || []" :dataIcons="false"
            :loading="pending" label="Top Countries" sub-label="Countries" :iconProvider="iconProvider"
            :customIconStyle="customIconStyle" desc=" Lists the countries where users access your website.">
        </DashboardBarsCard>
    </div>
</template>
