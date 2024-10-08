<script lang="ts" setup>


const browsersData = useFetch('/api/data/browsers', {
    headers: useComputedHeaders({ limit: 10, }), lazy: true
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

async function showMore() {
    dialogBarData.value=[];
    showDialog.value = true;
    isDataLoading.value = true;

    const res = await $fetch('/api/data/browsers', {
        headers: useComputedHeaders({ limit: 1000 }).value
    });

    dialogBarData.value = res || [];

    isDataLoading.value = false;

}

</script>


<template>
    <div class="flex flex-col gap-2">
        <BarCardBase @showMore="showMore()" @dataReload="browsersData.refresh()" :data="browsersData.data.value || []"
            desc="The browsers most used to search your website." :dataIcons="false"
            :loading="browsersData.pending.value" label="Top Browsers" sub-label="Browsers">
        </BarCardBase>
    </div>
</template>
