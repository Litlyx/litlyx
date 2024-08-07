<script lang="ts" setup>

import type { VisitsWebsiteAggregated } from '~/server/api/metrics/[project_id]/data/websites';

const activeProject = useActiveProject();

const { safeSnapshotDates } = useSnapshot()

const isShowMore = ref<boolean>(false);

const currentWebsite = ref<string>("");

const websitesHeaders = computed(() => {
    return {
        'x-from': safeSnapshotDates.value.from,
        'x-to': safeSnapshotDates.value.to,
        Authorization: authorizationHeaderComputed.value,
        limit: isShowMore.value === true ? '200' : '10'
    }
});

const pagesHeaders = computed(() => {
    return {
        'x-from': safeSnapshotDates.value.from,
        'x-to': safeSnapshotDates.value.to,
        Authorization: authorizationHeaderComputed.value,
        limit: isShowMore.value === true ? '200' : '10',
        'x-website-name': currentWebsite.value
    }
});

const websitesData = useFetch(`/api/metrics/${activeProject.value?._id}/data/websites`, {
    method: 'POST', headers: websitesHeaders, lazy: true, immediate: false
});

const pagesData = useFetch(`/api/metrics/${activeProject.value?._id}/data/pages`, {
    method: 'POST', headers: pagesHeaders, lazy: true, immediate: false
});

const isPagesView = ref<boolean>(false);

const currentData = computed(() => {
    return isPagesView.value ? pagesData : websitesData
})


async function showDetails(website: string) {
    currentWebsite.value = website;
    pagesData.execute();
    isPagesView.value = true;
}

async function showGeneral() {
    websitesData.execute();
    isPagesView.value = false;
}

const router = useRouter();

function goToView() {
    router.push('/dashboard/visits');
}

onMounted(()=>{
    websitesData.execute();
})

</script>


<template>
    <div class="flex flex-col gap-2 h-full">
        <DashboardBarsCard :hideShowMore="true" @showGeneral="showGeneral()" @showRawData="goToView()"
            @dataReload="currentData.refresh()" @showDetails="showDetails" :data="currentData.data.value || []"
            :loading="currentData.pending.value" :label="isPagesView ? 'Top pages' : 'Top Websites'"
            :sub-label="isPagesView ? 'Page' : 'Website'"
            :desc="isPagesView ? 'Most visited pages' : 'Most visited website in this project'"
            :interactive="!isPagesView" :rawButton="!isLiveDemo()" :isDetailView="isPagesView">
        </DashboardBarsCard>
    </div>
</template>
