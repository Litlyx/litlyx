<script lang="ts" setup>

const router = useRouter();

function goToView() {
    router.push('/dashboard/events');
}

const eventsData = useFetch('/api/data/events', {
    headers: useComputedHeaders({
        limit: 10,
    }), lazy: true
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

async function showMore() {
    dialogBarData.value=[];
    showDialog.value = true;
    isDataLoading.value = true;

    const res = await $fetch('/api/data/events', {
        headers: useComputedHeaders({ limit: 1000 }).value
    });

    dialogBarData.value = res || [];

    isDataLoading.value = false;

}

</script>


<template>
    <div class="flex flex-col gap-2 h-full">
        <BarCardBase @showMore="showMore()" @showRawData="goToView()"
            desc="Most frequent user events triggered in this project" @dataReload="eventsData.refresh()"
            :data="eventsData.data.value || []" :loading="eventsData.pending.value" label="Top Events"
            sub-label="Events" :rawButton="!isLiveDemo"></BarCardBase>
    </div>
</template>
