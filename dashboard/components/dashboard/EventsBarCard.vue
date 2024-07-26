<script lang="ts" setup>

const { data: events, pending, refresh } = useEventsData();

const router = useRouter();

function goToView() {
    router.push('/dashboard/events');
}

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {


    showDialog.value = true;
    dialogBarData.value = [];
    isDataLoading.value = true;

    const moreRes = useEventsData(200);

    moreRes.onResponse(data => {
        dialogBarData.value = data.value || [];
        isDataLoading.value = false;
    });

}


</script>


<template>
    <div class="flex flex-col gap-2 h-full">
        <DashboardBarsCard @showMore="showMore()" @showRawData="goToView()"
            desc="Most frequent user events triggered in this project" @dataReload="refresh" :data="events || []"
            :loading="pending" label="Top Events" sub-label="Events" :rawButton="!isLiveDemo()"></DashboardBarsCard>
    </div>
</template>
