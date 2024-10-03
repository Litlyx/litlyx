<script lang="ts" setup>

const router = useRouter();

function goToView() {
    router.push('/dashboard/events');
}

const isShowMore = ref<boolean>(false);

const eventsData = useFetch('/api/data/events', {
    headers: useComputedHeaders({
        limit: computed(() => isShowMore.value ? '200' : '10'),
    }), lazy: true
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {
    isShowMore.value = true;
    showDialog.value = true;
    dialogBarData.value = eventsData.data.value || [];
}

</script>


<template>
    <div class="flex flex-col gap-2 h-full">
        <BarCardBase @showMore="showMore()" @showRawData="goToView()"
            desc="Most frequent user events triggered in this project" @dataReload="eventsData.refresh()"
            :data="eventsData.data.value || []" :loading="eventsData.pending.value" label="Top Events"
            sub-label="Events" :rawButton="!isLiveDemo()"></BarCardBase>
    </div>
</template>
