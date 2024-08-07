<script lang="ts" setup>

import type { IconProvider } from './BarsCard.vue';

function iconProvider(id: string): ReturnType<IconProvider> {
    if (id === 'self') return ['icon', 'fas fa-link'];
    return [
        'img',
        `https://raw.githubusercontent.com/hampusborgos/country-flags/main/png250px/${id.toLowerCase()}.png`
    ]
}

const customIconStyle = `width: 2rem; padding: 1px;`

const activeProject = useActiveProject();

const { safeSnapshotDates } = useSnapshot()

const isShowMore = ref<boolean>(false);

const headers = computed(() => {
    return {
        'x-from': safeSnapshotDates.value.from,
        'x-to': safeSnapshotDates.value.to,
        Authorization: authorizationHeaderComputed.value,
        limit: isShowMore.value === true ? '200' : '10'
    }
});

const geolocationData = useFetch(`/api/metrics/${activeProject.value?._id}/data/countries`, {
    method: 'POST', headers, lazy: true, immediate: false
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

onMounted(async () => {
    geolocationData.execute();
});

</script>


<template>
    <div class="flex flex-col gap-2">
        <DashboardBarsCard @showMore="showMore()" @dataReload="geolocationData.refresh()" :data="geolocationData.data.value || []" :dataIcons="false"
            :loading="geolocationData.pending.value" label="Top Countries" sub-label="Countries" :iconProvider="iconProvider"
            :customIconStyle="customIconStyle" desc=" Lists the countries where users access your website.">
        </DashboardBarsCard>
    </div>
</template>
