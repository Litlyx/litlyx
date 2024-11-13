<script lang="ts" setup>


const ossData = useFetch('/api/data/oss', {
    headers: useComputedHeaders({
        limit: 10,
    }), lazy: true
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();


async function showMore() {
    dialogBarData.value=[];
    showDialog.value = true;
    isDataLoading.value = true;

    const res = await $fetch('/api/data/oss', {
        headers: useComputedHeaders({ limit: 1000 }).value
    });

    dialogBarData.value = res || [];

    isDataLoading.value = false;

}
</script>


<template>
    <div class="flex flex-col gap-2 h-full">
        <BarCardBase @showMore="showMore()" @dataReload="ossData.refresh()" :data="ossData.data.value || []"
            desc="The operating systems most commonly used by your website's visitors." :dataIcons="false"
            :loading="ossData.pending.value" label="OS" sub-label="OSs"></BarCardBase>
    </div>
</template>
