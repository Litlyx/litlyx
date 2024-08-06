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

const browsersData = useFetch(`/api/metrics/${activeProject.value?._id}/data/browsers`, {
    method: 'POST', headers, lazy: true, immediate: false
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();


function showMore() {
    isShowMore.value = true;
    showDialog.value = true;
    dialogBarData.value = browsersData.data.value || [];

}

onMounted(() => {
    browsersData.execute();
});

</script>


<template>
    <div class="flex flex-col gap-2">
        <DashboardBarsCard @showMore="showMore()" @dataReload="browsersData.refresh()"
            :data="browsersData.data.value || []" desc="The browsers most used to search your website."
            :dataIcons="false" :loading="browsersData.pending.value" label="Top Browsers" sub-label="Browsers">
        </DashboardBarsCard>
    </div>
</template>
