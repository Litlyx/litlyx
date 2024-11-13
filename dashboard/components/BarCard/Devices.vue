<script lang="ts" setup>


import type { IconProvider } from './Base.vue';

function iconProvider(e: { _id: string, count: number }): ReturnType<IconProvider> {
    if (e._id === 'desktop') return ['icon','far fa-desktop'];
    if (e._id === 'tablet') return ['icon','far fa-tablet'];
    if (e._id === 'mobile') return ['icon','far fa-mobile'];
    if (e._id === 'smarttv') return ['icon','far fa-tv'];
    if (e._id === 'console') return ['icon','far fa-game-console-handheld'];
    return ['icon', 'far fa-question']
}


function transform(data: { _id: string, count: number }[]) {
    console.log(data);
    return data.map(e => ({ ...e, _id: e._id == null ? 'unknown' : e._id }))
}

const devicesData = useFetch('/api/data/devices', {
    headers: useComputedHeaders({ limit: 10, }), lazy: true,
    transform
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

async function showMore() {
    dialogBarData.value = [];
    showDialog.value = true;
    isDataLoading.value = true;

    const res = await $fetch('/api/data/devices', {
        headers: useComputedHeaders({ limit: 1000 }).value,
    });


    dialogBarData.value = transform(res || []);

    isDataLoading.value = false;


}

</script>


<template>
    <div class="flex flex-col gap-2 h-full">
        <BarCardBase @showMore="showMore()" @dataReload="devicesData.refresh()" :data="devicesData.data.value || []"
            :iconProvider="iconProvider" :dataIcons="true" desc="The devices most used to access your website."
            :loading="devicesData.pending.value" label="Devices" sub-label="Devices"></BarCardBase>
    </div>
</template>
