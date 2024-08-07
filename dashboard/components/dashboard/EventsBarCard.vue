<script lang="ts" setup>

const router = useRouter();

function goToView() {
    router.push('/dashboard/events');
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

const eventsData = useFetch(`/api/metrics/${activeProject.value?._id}/data/events`, {
    method: 'POST', headers, lazy: true, immediate: false
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {
    isShowMore.value = true;
    showDialog.value = true;
    dialogBarData.value = eventsData.data.value || [];
}

onMounted(async () => {
    eventsData.execute();
});


</script>


<template>
    <div class="flex flex-col gap-2 h-full">
        <DashboardBarsCard @showMore="showMore()" @showRawData="goToView()"
            desc="Most frequent user events triggered in this project" @dataReload="eventsData.refresh()"
            :data="eventsData.data.value || []" :loading="eventsData.pending.value" label="Top Events"
            sub-label="Events" :rawButton="!isLiveDemo()"></DashboardBarsCard>
    </div>
</template>
