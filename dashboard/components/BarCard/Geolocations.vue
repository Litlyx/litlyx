<script lang="ts" setup>

import type { IconProvider } from '../BarCard/Base.vue';

function iconProvider(id: string): ReturnType<IconProvider> {
    if (id === 'self') return ['icon', 'fas fa-link'];
    return [
        'img',
        `https://raw.githubusercontent.com/hampusborgos/country-flags/main/png250px/${id.toLowerCase()}.png`
    ]
}

const customIconStyle = `width: 2rem; padding: 1px;`

const geolocationData = useFetch('/api/data/countries', {
    headers: useComputedHeaders({ limit: 10, }), lazy: true
});


const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

async function showMore() {
    dialogBarData.value=[];
    showDialog.value = true;
    isDataLoading.value = true;

    const res = await $fetch('/api/data/countries', {
        headers: useComputedHeaders({limit: 1000}).value
    });

    dialogBarData.value = res?.map(e => {
        return { ...e, icon: iconProvider(e._id) }
    }) || [];

    isDataLoading.value = false;

}

</script>


<template>
    <div class="flex flex-col gap-2">
        <BarCardBase @showMore="showMore()" @dataReload="geolocationData.refresh()"
            :data="geolocationData.data.value || []" :dataIcons="false" :loading="geolocationData.pending.value"
            label="Top Countries" sub-label="Countries" :iconProvider="iconProvider" :customIconStyle="customIconStyle"
            desc=" Lists the countries where users access your website.">
        </BarCardBase>
    </div>
</template>
