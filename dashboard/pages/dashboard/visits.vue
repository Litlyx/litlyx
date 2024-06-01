<script setup lang="ts">
import type { MetricsCounts } from '~/server/api/metrics/[project_id]/counts';


definePageMeta({ layout: 'dashboard' });

const activeProject = useActiveProject();

const metricsInfo = ref<number>(0);

const columns = [
    { key: 'website', label: 'Website', sortable: true },
    { key: 'page', label: 'Page', sortable: true },
    { key: 'referrer', label: 'Referrer', sortable: true },
    { key: 'session', label: 'Session', sortable: true },
    { key: 'browser', label: 'Browser', sortable: true },
    { key: 'os', label: 'OS', sortable: true },
    { key: 'screen', label: 'Screen', sortable: true },
    { key: 'created_at', label: 'Date', sortable: true }
]

const sort = ref({
    column: 'created_at',
    direction: 'desc'
})

const selectedColumns = ref([...columns]);

const page = ref<number>(1);
const itemsPerPage = 50;
const totalItems = computed(() => metricsInfo.value);


const { data: tableData, pending: loadingData } = await useLazyFetch<any[]>(() =>
    `/api/metrics/${activeProject.value?._id}/query?type=0&orderBy=${sort.value.column}&order=${sort.value.direction}&page=${page.value}&limit=${itemsPerPage}`, {
    ...signHeaders(),
})

onMounted(async () => {
    const counts = await $fetch<MetricsCounts>(`/api/metrics/${activeProject.value?._id}/counts`, signHeaders());
    metricsInfo.value = counts.visitsCount;
});


</script>


<template>


    <div class="w-full h-dvh flex flex-col">

        <div class="flex justify-end px-12 py-3">
            <div
                class="bg-[#57c78fc0] hover:bg-[#57c78fab] cursor-pointer text-text poppins font-semibold px-8 py-2 rounded-lg">
                Download CSV
            </div>
        </div>

        <UTable v-if="tableData" class="utable px-8" :ui="{
            wrapper: 'overflow-auto w-full h-full',
            thead: 'sticky top-0 bg-menu',
            td: {
                color: 'text-[#ffffffb3]',
                base: 'border-r border-l border-gray-300/20'
            },
            th: { color: 'text-text-sub' },
            tbody: 'divide-y divide-gray-300/20',
            divide: '',
        }" v-model:sort="sort" :columns="selectedColumns" :rows="tableData" :loading="loadingData" sort-mode="manual"
            :sortButton="{ color: '#000000' }">

            <template #metadata-data="{ row }">
                <div v-if="row.metadata" class="flex flex-col gap-1">
                    <div v-for="(value, key) in JSON.parse(row.metadata)">
                        <span class="font-bold">{{ key }}</span>: {{ value }}
                    </div>
                </div>
            </template>

            <template #screen-data="{ row }">
                <span> {{ row.screenWidth }}x{{ row.screenHeight }} </span>
            </template>

            <template #userAgent-data="{ row }">
                <span> {{ row.userAgent }} </span>
            </template>

            <template #created_at-data="{ row }">
                <span> {{ new Date(row.created_at).toLocaleString() }} </span>
            </template>

        </UTable>

        <div class="flex justify-end px-3 py-3 border-t border-gray-300/30 dark:border-gray-700">
            <UPagination v-model="page" :page-count="itemsPerPage" :total="totalItems" />
        </div>

    </div>

</template>

<style scoped lang="scss">
.card {
    @apply border text-2xl text-text bg-transparent border-gray-500 border-[1] w-fit px-8 h-[7rem] flex flex-col items-center justify-center gap-1 rounded-xl;
}
</style>
