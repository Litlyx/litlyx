<script lang="ts" setup>

const { data: browsers, pending, refresh } = useBrowsersData(10);
const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {

    showDialog.value = true;
    dialogBarData.value = [];
    isDataLoading.value = true;

    const moreRes = useBrowsersData(200);

    moreRes.onResponse(data => {
        dialogBarData.value = data.value || [];
        isDataLoading.value = false;
    });
    
}

</script>


<template>
    <div class="flex flex-col gap-2">
        <DashboardBarsCard @showMore="showMore()" @dataReload="refresh" :data="browsers || []"
            desc="The browsers most used to search your website." :dataIcons="false" :loading="pending"
            label="Top Browsers" sub-label="Browsers"></DashboardBarsCard>
    </div>
</template>
