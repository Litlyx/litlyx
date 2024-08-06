<script lang="ts" setup>

import type { IconProvider } from './BarsCard.vue';
import ReferrerBarChart from '../referrer/ReferrerBarChart.vue';

function iconProvider(id: string): ReturnType<IconProvider> {
    if (id === 'self') return ['icon', 'fas fa-link'];
    return ['img', `https://s2.googleusercontent.com/s2/favicons?domain=${id}&sz=64`]
}

function elementTextTransformer(element: string) {
    if (element === 'self') return 'Direct Link';
    return element;
}

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

const referrersData = useFetch(`/api/metrics/${activeProject.value?._id}/data/referrers`, {
    method: 'POST', headers, lazy: true, immediate: false
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

const customDialog = useCustomDialog();

function onShowDetails(referrer: string) {
    customDialog.openDialog(ReferrerBarChart, { slice: 'day', referrer });
}

function showMore() {

    isShowMore.value = true;
    showDialog.value = true;
    dialogBarData.value = referrersData.data.value?.map(e => {
        return { ...e, icon: iconProvider(e._id) }
    }) || [];

}

onMounted(async () => {
   referrersData.execute();
});

</script>


<template>
    <div class="flex flex-col gap-2">
        <DashboardBarsCard @showDetails="onShowDetails" @showMore="showMore()"
            :elementTextTransformer="elementTextTransformer" :iconProvider="iconProvider"
            @dataReload="referrersData.refresh()" :showLink=true :data="referrersData.data.value || []"
            :interactive="true" desc="Where users find your website." :dataIcons="true" :loading="referrersData.pending.value"
            label="Top Referrers" sub-label="Referrers"></DashboardBarsCard>
    </div>
</template>
