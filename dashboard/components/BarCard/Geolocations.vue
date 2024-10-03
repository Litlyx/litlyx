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

const isShowMore = ref<boolean>(false);

const geolocationData = useFetch('/api/data/countries', {
    headers: useComputedHeaders({
        limit: computed(() => isShowMore.value ? '200' : '10'),
    }), lazy: true
});


const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {

    isShowMore.value = true;
    showDialog.value = true;

    dialogBarData.value = geolocationData.data.value?.map(e => {
        return { ...e, icon: iconProvider(e._id) }
    }) || [];
    isDataLoading.value = false;

}

</script>


<template>
    <div class="flex flex-col gap-2">
        <BarCardBase @showMore="showMore()" @dataReload="geolocationData.refresh()" :data="geolocationData.data.value || []" :dataIcons="false"
            :loading="geolocationData.pending.value" label="Top Countries" sub-label="Countries" :iconProvider="iconProvider"
            :customIconStyle="customIconStyle" desc=" Lists the countries where users access your website.">
        </BarCardBase>
    </div>
</template>
