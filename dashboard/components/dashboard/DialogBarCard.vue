<script lang="ts" setup>

const { dialogBarData, isDataLoading } = useBarCardDialog();


const columns = [
    { key: '_id', label: 'Value' },
    { key: 'count', label: 'Count' },
];

</script>


<template>

    <div class="w-full h-full bg-lyx-lightmode-background dark:bg-lyx-background-light rounded-xl p-8">
        <div class="full h-full overflow-y-auto text-lyx-lightmode-text dark:text-lyx-text">
            <UTable :columns="columns" :rows="dialogBarData" :loading="isDataLoading" v-if="dialogBarData">
                <template #count-data="{ row }">
                    <div class="font-bold"> {{ formatNumberK(row.count) }} </div>
                </template>

                <template #_id-data="{ row }">
                    <div class="flex items-center gap-3">
                        <div v-if="row.icon && row.icon[0] == 'img'" class="w-5 h-5">
                            <img class="w-full h-full" :src="row.icon[1]">
                        </div>
                        <i v-if="row.icon && row.icon[0] == 'icon'" :class="row.icon[1]"></i>
                        <div> {{ row._id }} </div>
                    </div>
                </template>
            </UTable>
        </div>
    </div>

</template>
