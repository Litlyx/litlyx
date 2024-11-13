<script lang="ts" setup>

import type { IconProvider } from './Base.vue';

function iconProvider(e: { _id: string, count: number }): ReturnType<IconProvider> {
    if (e._id === 'self') return ['icon', 'fas fa-link'];
    return ['img', `https://s2.googleusercontent.com/s2/favicons?domain=${e._id}&sz=64`]
}

function elementTextTransformer(element: string) {
    if (element === 'self') return 'Direct Link';
    return element;
}

const referrersData = useFetch('/api/data/referrers', {
    headers: useComputedHeaders({
        limit: 10,
    }), lazy: true
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

async function showMore() {

    dialogBarData.value = [];

    showDialog.value = true;
    isDataLoading.value = true;

    const res = await $fetch('/api/data/referrers', {
        headers: useComputedHeaders({ limit: 1000 }).value
    });


    dialogBarData.value = res?.map(e => {
        return { ...e, icon: iconProvider(e as any) }
    }) || [];

    isDataLoading.value = false;
}

</script>


<template>
    <div class="flex flex-col gap-2">
        <BarCardBase @showMore="showMore()" :elementTextTransformer="elementTextTransformer"
            :iconProvider="iconProvider" @dataReload="referrersData.refresh()" :showLink=true
            :data="referrersData.data.value || []" :interactive="false" desc="Where users find your website."
            :dataIcons="true" :loading="referrersData.pending.value" label="Top Sources" sub-label="Referrers">
        </BarCardBase>
    </div>
</template>
