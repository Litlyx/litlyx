<script setup lang="ts">
import type { TVisit } from '~/shared/schema/metrics/VisitSchema';


definePageMeta({ layout: 'sidebar' });

const currentPage = ref<number>(1);

const exporting = ref<boolean>(false);

const { data: visits, status: visitsStatus } = useAuthFetch<{ count: number, data: TVisit[] }>(() => `/api/raw/visits?limit=10&page=${currentPage.value}`);

const { permissions } = useProjectStore();

function onPageChange(newPage: number) {
    currentPage.value = newPage;
}

async function exportCsv() {
    if (exporting.value) return;
    exporting.value = true;
    const result = await useAuthFetchSync(`/api/raw/export_visits`);
    const blob = new Blob([result as any], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ReportVisits.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    exporting.value = false;
}

</script>

<template>

    <Unauthorized v-if="permissions?.webAnalytics === false" authorization="webAnalytics">
    </Unauthorized>

    <div v-if="permissions?.webAnalytics === true && visitsStatus !== 'success'" class="flex justify-center mt-20">
        <Loader></Loader>
    </div>


    <div v-else class="flex flex-col gap-4 p-4">
        <div class="flex justify-between">
            <PageHeader title="Raw Visits"/>
            <Button @click="exportCsv()" class="!w-[7rem]">
                <Loader v-if="exporting" class="!size-4"></Loader>
                <span v-else> Export CSV</span>
            </Button>
        </div>



        <div class="flex flex-col gap-2">

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-[15%]"> Domain </TableHead>
                        <TableHead class="w-[15%]"> Page </TableHead>
                        <TableHead class="w-[15%]"> Referrer </TableHead>
                        <TableHead class="w-[5%]"> Browser </TableHead>
                        <TableHead class="w-[5%]"> Os </TableHead>
                        <TableHead class="w-[5%]"> Continent </TableHead>
                        <TableHead class="w-[5%]"> Country </TableHead>
                        <TableHead class="w-[5%]"> Device </TableHead>
                        <TableHead class="w-[15%]"> Date </TableHead>
                        <TableHead class="w-[15%]"> Session </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="visit of visits?.data ?? []">
                        <TableCell class="w-[15%]">{{ visit.website }}</TableCell>
                        <TableCell class="w-[15%]">{{ visit.page }}</TableCell>
                        <TableCell class="w-[15%]">{{ visit.referrer }}</TableCell>
                        <TableCell class="w-[5%]">{{ visit.browser }}</TableCell>
                        <TableCell class="w-[5%]">{{ visit.os }}</TableCell>
                        <TableCell class="w-[5%]">{{ visit.continent }}</TableCell>
                        <TableCell class="w-[5%]">{{ visit.country }}</TableCell>
                        <TableCell class="w-[5%]">{{ visit.device }}</TableCell>
                        <TableCell class="w-[15%]">{{ visit.created_at }}</TableCell>
                        <TableCell class="w-[15%]">{{ visit.session }}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Pagination class="mt-8" v-if="visits" @update:page="onPageChange" v-slot="{ page }" :items-per-page="10"
                :total="visits.count" :default-page="currentPage">
                <PaginationContent v-slot="{ items }">
                    <PaginationPrevious />
                    <template v-for="(item, index) in items" :key="index">
                        <PaginationItem v-if="item.type === 'page'" :value="item.value"
                            :is-active="item.value === page">
                            {{ item.value }}
                        </PaginationItem>
                    </template>
                    <PaginationEllipsis :index="4" />
                    <PaginationNext />
                </PaginationContent>
            </Pagination>

        </div>

    </div>

</template>