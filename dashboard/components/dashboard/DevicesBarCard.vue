<script lang="ts" setup>

const { data: devices, pending, refresh } = useDevicesData(10);

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {


    showDialog.value = true;
    dialogBarData.value = [];
    isDataLoading.value = true;

    const moreRes = useDevicesData(200);

    moreRes.onResponse(data => {
        dialogBarData.value = data.value || [];
        isDataLoading.value = false;
    });

}

</script>


<template>
    <div class="flex flex-col gap-2">
        <DashboardBarsCard @showMore="showMore()" @dataReload="refresh" :data="devices || []" :dataIcons="false"
            desc="The devices most used to access your website." :loading="pending" label="Top Devices"
            sub-label="Devices"></DashboardBarsCard>
    </div>
</template>
