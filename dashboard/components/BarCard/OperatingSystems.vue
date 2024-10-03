<script lang="ts" setup>

const isShowMore = ref<boolean>(false);

const ossData = useFetch('/api/data/oss', {
    headers: useComputedHeaders({
        limit: computed(() => isShowMore.value ? '200' : '10'),
    }), lazy: true
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();


function showMore() {
    isShowMore.value = true;
    showDialog.value = true;
    dialogBarData.value = ossData.data.value || [];
}


</script>


<template>
    <div class="flex flex-col gap-2 h-full">
        <BarCardBase @showMore="showMore()" @dataReload="ossData.refresh()" :data="ossData.data.value || []"
            desc="The operating systems most commonly used by your website's visitors." :dataIcons="false"
            :loading="ossData.pending.value" label="Top OS" sub-label="OSs"></BarCardBase>
    </div>
</template>
