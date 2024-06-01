<script lang="ts" setup>

import type { VisitsWebsiteAggregated } from '~/server/api/metrics/[project_id]/data/websites';

const { data: websites, pending, refresh } = useWebsitesData();

const currentViewData = ref<(VisitsWebsiteAggregated[] | null)>(websites.value);

watch(pending, () => {
    currentViewData.value = websites.value;
})

const isPagesView = ref<boolean>(false);
const isLoading = ref<boolean>(false);

async function showDetails(website: string) {
    if (isPagesView.value == true) return;
    isLoading.value = true;
    isPagesView.value = true;

    const { data: pagesData, pending } = usePagesData(website, 10);

    watch(pending, () => {
        currentViewData.value = pagesData.value;
        isLoading.value = false;
    })

}

const router = useRouter();

function goToView() {
    router.push('/dashboard/visits');
}

function setDefaultData() {
    currentViewData.value = websites.value;
    isPagesView.value = false;
}

async function dataReload() {
    await refresh();
    setDefaultData();
}



</script>


<template>
    <div class="flex flex-col gap-2">
        <DashboardBarsCard :hideShowMore="true" @showGeneral="setDefaultData()" @showRawData="goToView()"
            @dataReload="dataReload()" @showDetails="showDetails" :data="currentViewData || []"
            :loading="pending || isLoading" :label="isPagesView ? 'Top pages' : 'Top Websites'"
            :sub-label="isPagesView ? 'Page' : 'Website'"
            :desc="isPagesView ? 'Most visited pages' : 'Most visited website in this project'"
            :interactive="!isPagesView" :rawButton="!isLiveDemo()" :isDetailView="isPagesView">
        </DashboardBarsCard>
    </div>
</template>
