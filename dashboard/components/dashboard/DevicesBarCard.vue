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

const devicesData = useFetch(`/api/metrics/${activeProject.value?._id}/data/devices`, {
    method: 'POST', headers, lazy: true, immediate: false
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();


function showMore() {
    isShowMore.value = true;
    showDialog.value = true;
    dialogBarData.value = devicesData.data.value || [];

}


onMounted(() => {
    devicesData.execute();
});

</script>


<template>
    <div class="flex flex-col gap-2">
        <DashboardBarsCard @showMore="showMore()" @dataReload="devicesData.refresh()" :data="devicesData.data.value || []" :dataIcons="false"
            desc="The devices most used to access your website." :loading="devicesData.pending.value" label="Top Devices"
            sub-label="Devices"></DashboardBarsCard>
    </div>
</template>
