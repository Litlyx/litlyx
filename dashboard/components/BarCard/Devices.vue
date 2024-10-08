<script lang="ts" setup>


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
    <div class="flex flex-col gap-2">
        <BarCardBase @showMore="showMore()" @dataReload="devicesData.refresh()" :data="devicesData.data.value || []"
            :dataIcons="false" desc="The devices most used to access your website." :loading="devicesData.pending.value"
            label="Top Devices" sub-label="Devices"></BarCardBase>
    </div>
</template>
