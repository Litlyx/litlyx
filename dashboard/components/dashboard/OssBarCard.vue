<script lang="ts" setup>

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

const ossData = useFetch(`/api/metrics/${activeProject.value?._id}/data/oss`, {
    method: 'POST', headers, lazy: true, immediate: false
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();


function showMore() {
    isShowMore.value = true;
    showDialog.value = true;
    dialogBarData.value = ossData.data.value || [];
}

onMounted(() => {
    ossData.execute();
});

</script>


<template>
    <div class="flex flex-col gap-2 h-full">
        <DashboardBarsCard @showMore="showMore()" @dataReload="ossData.refresh()" :data="ossData.data.value || []"
            desc="The operating systems most commonly used by your website's visitors." :dataIcons="false"
            :loading="ossData.pending.value" label="Top OS" sub-label="OSs"></DashboardBarsCard>
    </div>
</template>
