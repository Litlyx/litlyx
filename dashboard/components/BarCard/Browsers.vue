<script lang="ts" setup>

const isShowMore = ref<boolean>(false);

const browsersData = useFetch('/api/data/browsers', {
    headers: useComputedHeaders({
        limit: computed(() => isShowMore.value ? '200' : '10'),
    }), lazy: true
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {
    isShowMore.value = true;
    showDialog.value = true;
    dialogBarData.value = browsersData.data.value || [];

}

</script>


<template>
    <div class="flex flex-col gap-2">
        <BarCardBase @showMore="showMore()" @dataReload="browsersData.refresh()"
            :data="browsersData.data.value || []" desc="The browsers most used to search your website."
            :dataIcons="false" :loading="browsersData.pending.value" label="Top Browsers" sub-label="Browsers">
        </BarCardBase>
    </div>
</template>
