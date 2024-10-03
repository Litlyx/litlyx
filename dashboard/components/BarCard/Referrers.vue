<script lang="ts" setup>

import type { IconProvider } from './Base.vue';

function iconProvider(id: string): ReturnType<IconProvider> {
    if (id === 'self') return ['icon', 'fas fa-link'];
    return ['img', `https://s2.googleusercontent.com/s2/favicons?domain=${id}&sz=64`]
}

function elementTextTransformer(element: string) {
    if (element === 'self') return 'Direct Link';
    return element;
}

const isShowMore = ref<boolean>(false);

const referrersData = useFetch('/api/data/referrers', {
    headers: useComputedHeaders({
        limit: computed(() => isShowMore.value ? '200' : '10'),
    }), lazy: true
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

function showMore() {
    isShowMore.value = true;
    showDialog.value = true;
    dialogBarData.value = referrersData.data.value?.map(e => {
        return { ...e, icon: iconProvider(e._id) }
    }) || [];
}

</script>


<template>
    <div class="flex flex-col gap-2">
        <BarCardBase @showMore="showMore()" :elementTextTransformer="elementTextTransformer"
            :iconProvider="iconProvider" @dataReload="referrersData.refresh()" :showLink=true
            :data="referrersData.data.value || []" :interactive="false" desc="Where users find your website."
            :dataIcons="true" :loading="referrersData.pending.value" label="Top Referrers" sub-label="Referrers">
        </BarCardBase>
    </div>
</template>
