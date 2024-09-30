<script setup lang="ts">
import type { MetricsCounts } from '~/server/api/metrics/[project_id]/counts';


definePageMeta({ layout: 'dashboard' });

const activeProject = useActiveProject();

const isPremium = computed(() => (activeProject.value?.premium_type || 0) > 0);

const metricsInfo = ref<number>(0);

const columns = [
    { key: 'website', label: 'Website', sortable: true },
    { key: 'page', label: 'Page', sortable: true },
    { key: 'referrer', label: 'Referrer', sortable: true },
    { key: 'browser', label: 'Browser', sortable: true },
    { key: 'os', label: 'OS', sortable: true },
    { key: 'continent', label: 'Continent', sortable: true },
    { key: 'country', label: 'Country', sortable: true },
    { key: 'device', label: 'Device', sortable: true },
    { key: 'created_at', label: 'Date', sortable: true }
]

const sort = ref<any>({
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


const creatingCsv = ref<boolean>(false);

async function downloadCSV(isGoogle: boolean) {
    creatingCsv.value = true;
    const result = await $fetch(`/api/project/generate_csv?mode=visits&slice=${options.indexOf(selectedTimeFrom.value)}`,
        signHeaders({ 'x-google-export': isGoogle ? 'true' : 'false' })
    );
    if (!isGoogle) {
        const blob = new Blob([result as any], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ReportVisits.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } else {
        alert(result);
    }
    creatingCsv.value = false;
}


const options = ['Last day', 'Last week', 'Last month', 'Total']
const selectedTimeFrom = ref<string>(options[0]);

const showWarning = computed(() => {
    return options.indexOf(selectedTimeFrom.value) > 1
})

const pricingDrawer = usePricingDrawer();

function goToUpgrade() {
    pricingDrawer.visible.value = true;
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
                <USelectMenu v-model="selectedTimeFrom" :options="options"></USelectMenu>
            </div>

            <div v-if="isPremium" @click="downloadCSV(false)"
                class="bg-[#57c78fc0] hover:bg-[#57c78fab] cursor-pointer text-text poppins font-semibold px-8 py-2 rounded-lg">
                Download CSV
            </div>

            <div v-if="isPremium" @click="downloadCSV(true)"
                class="bg-[#57c78fc0] hover:bg-[#57c78fab] cursor-pointer text-text poppins font-semibold px-8 py-2 rounded-lg">
                Export CSV to Google Sheets
            </div>

            <!-- <div v-if="!isPremium" @click="goToUpgrade()"
                class="bg-[#57c78f46] hover:bg-[#57c78f42] flex gap-4 items-center cursor-pointer text-text poppins font-semibold px-8 py-2 rounded-lg">
                <i class="far fa-lock"></i>
                Upgrade plan for CSV
            </div> -->

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
