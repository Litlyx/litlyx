<script setup lang="ts">
import type { MetricsCounts } from '~/server/api/metrics/[project_id]/counts';


definePageMeta({ layout: 'dashboard' });

const { project } = useProject();

const isPremium = computed(() => (project.value?.premium_type || 0) > 0);
const selfhosted = useSelfhosted();
const canDownload = computed(() => {
    if (selfhosted) return true;
    return isPremium.value;
});

const metricsInfo = ref<number>(0);

const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'metadata', label: 'Metadata' },
    { key: 'created_at', label: 'Creation', sortable: true }
]

const sort = ref<any>({
    column: 'created_at',
    direction: 'desc'
})

const selectedColumns = ref([...columns]);

const page = ref<number>(1);
const itemsPerPage = 50;
const totalItems = computed(() => metricsInfo.value);


const { data: tableData, pending: loadingData } = await useFetch<any[]>(() =>
    `/api/metrics/${project.value?._id}/query?type=1&orderBy=${sort.value.column}&order=${sort.value.direction}&page=${page.value}&limit=${itemsPerPage}`, {
    ...signHeaders(), lazy: true
})

onMounted(async () => {
    const counts = await $fetch<MetricsCounts>(`/api/metrics/${project.value?._id}/counts`, signHeaders());
    metricsInfo.value = counts.eventsCount;
});

const creatingCsv = ref<boolean>(false);

async function downloadCSV() {
    creatingCsv.value = true;
    const result = await $fetch(`/api/project/generate_csv?mode=events&slice=${options.indexOf(selectedTimeFrom.value)}`, {
        headers: useComputedHeaders({ useSnapshotDates: false }).value
    });
    const blob = new Blob([result as any], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ReportEvents.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    creatingCsv.value = false;
}

const options = ['Last day', 'Last week', 'Last month', 'Total']
const selectedTimeFrom = ref<string>(options[0]);

const showWarning = computed(() => {
    return options.indexOf(selectedTimeFrom.value) > 1
})


const { showDrawer } = useDrawer();

function goToUpgrade() {
   showDrawer('PRICING');
}
</script>



<template>



    <div class="w-full h-dvh flex flex-col">

        <div v-if="creatingCsv"
            class="fixed z-[100] flex items-center justify-center left-0 top-0 w-full h-full bg-black/60 backdrop-blur-[4px]">
            <div class="poppins text-[2rem]">
                Creating csv...
            </div>
        </div>


        <div class="flex justify-end px-12 py-3 items-center gap-2">

            <div v-if="showWarning" class="text-orange-400 flex gap-2 items-center">
                <i class="far fa-warning "></i>
                <div> It can take a few minutes </div>
            </div>
            <div class="w-[15rem] flex flex-col gap-0">
                <USelectMenu :uiMenu="{
                    select: '!bg-lyx-widget-light !shadow-none focus:!ring-lyx-widget-lighter !ring-lyx-widget-lighter',
                    base: '!bg-lyx-widget',
                    option: {
                        base: 'hover:!bg-lyx-widget-lighter cursor-pointer',
                        active: '!bg-lyx-widget-lighter'
                    }
                }" v-model="selectedTimeFrom" :options="options"></USelectMenu>
            </div>

            <div v-if="canDownload" @click="downloadCSV()"
                class="bg-[#57c78fc0] hover:bg-[#57c78fab] cursor-pointer text-text poppins font-semibold px-8 py-1 rounded-lg">
                Download CSV
            </div>

            <div v-if="!canDownload" @click="goToUpgrade()"
                class="bg-[#57c78f46] hover:bg-[#57c78f42] flex gap-4 items-center cursor-pointer text-text poppins font-semibold px-8 py-2 rounded-lg">
                <i class="far fa-lock"></i>
                Upgrade plan for CSV
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
        }" v-model:sort="sort" :columns="selectedColumns" :rows="tableData" :loading="loadingData" sort-mode="manual">

            <template #metadata-data="{ row }">
                <div v-if="row.metadata" class="flex flex-col gap-1">
                    <div v-for="(value, key) in row.metadata">
                        <span class="font-bold">{{ key }}</span>: {{ value }}
                    </div>
                </div>
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
