<script lang="ts" setup>

const { data: oss, pending, refresh } = useOssData()
const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {

    showDialog.value = true;
    dialogBarData.value = [];
    isDataLoading.value = true;

    const moreRes = useOssData(200);

    moreRes.onResponse(data => {
        dialogBarData.value = data.value || [];
        isDataLoading.value = false;
    })

}

</script>


<template>
    <div class="flex flex-col gap-2 h-full">
        <DashboardBarsCard @showMore="showMore()" @dataReload="refresh" :data="oss || []"
            desc="The operating systems most commonly used by your website's visitors." :dataIcons="false"
            :loading="pending" label="Top OS" sub-label="OSs"></DashboardBarsCard>
    </div>
</template>
