<script lang="ts" setup>

const pagesData = useFetch('/api/data/pages', {
    headers: useComputedHeaders({
        limit: 10,
    }), lazy: true
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

async function showMore() {

    dialogBarData.value = [];

    showDialog.value = true;
    isDataLoading.value = true;

    const res = await $fetch('/api/data/pages', {
        headers: useComputedHeaders({ limit: 1000 }).value
    });
    
    dialogBarData.value = (res || []);

    isDataLoading.value = false;
}

</script>


<template>
    <div class="flex flex-col gap-2 h-full">
        <BarCardBase @showMore="showMore()" @dataReload="pagesData.refresh()" :showLink=true
            :data="pagesData.data.value || []" :interactive="false" desc="Most visited pages."
            :dataIcons="true" :loading="pagesData.pending.value" label="Top Pages" sub-label="Referrers">
        </BarCardBase>
    </div>
</template>
