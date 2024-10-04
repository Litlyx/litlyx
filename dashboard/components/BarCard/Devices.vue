<script lang="ts" setup>

const isShowMore = ref<boolean>(false);

const devicesData = useFetch('/api/data/devices', {
    headers: useComputedHeaders({
        limit: computed(() => isShowMore.value ? '200' : '10'),
    }), lazy: true
});


const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();


function showMore() {
    isShowMore.value = true;
    showDialog.value = true;
    dialogBarData.value = devicesData.data.value || [];

}

</script>


<template>
    <div class="flex flex-col gap-2">
        <BarCardBase @showMore="showMore()" @dataReload="devicesData.refresh()" :data="devicesData.data.value || []"
            :dataIcons="false" desc="The devices most used to access your website." :loading="devicesData.pending.value"
            label="Top Devices" sub-label="Devices"></BarCardBase>
    </div>
</template>
