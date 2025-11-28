<script setup lang="ts">
import type { TEvent } from '~/shared/schema/metrics/EventSchema';


definePageMeta({ layout: 'sidebar' });

const currentPage = ref<number>(1);

const exporting = ref<boolean>(false);

const { data: events, status: eventsStatus } = useAuthFetch<{ count: number, data: TEvent[] }>(() => `/api/raw/events?limit=10&page=${currentPage.value}`);

const { permissions } = useProjectStore();

function onPageChange(newPage: number) {
    currentPage.value = newPage;
}

async function exportCsv() {
    if (exporting.value) return;
    exporting.value = true;
    const result = await useAuthFetchSync(`/api/raw/export_events`);
    const blob = new Blob([result as any], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ReportEvents.csv';
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

    <div v-if="permissions?.webAnalytics === true && eventsStatus !== 'success'" class="flex justify-center mt-20">
        <Loader></Loader>
    </div>

    <div v-else class="flex flex-col gap-4 p-4">
        <div class="flex justify-between">
            <PageHeader title="Raw Events"/>
            <Button @click="exportCsv()" class="!w-[7rem]">
                <Loader v-if="exporting" class="!size-4"></Loader>
                <span v-else> Export CSV</span>
            </Button>
        </div>

        <div class="flex flex-col gap-2">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead> Domain </TableHead>
                        <TableHead> Name </TableHead>
                        <TableHead> Metadata </TableHead>
                        <TableHead> Date </TableHead>
                        <TableHead> Session </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="event of events?.data ?? []">
                        <TableCell>{{ event.website }}</TableCell>
                        <TableCell>{{ event.name }}</TableCell>
                        <TableCell>{{ event.metadata }}</TableCell>
                        <TableCell>{{ event.created_at }}</TableCell>
                        <TableCell>{{ event.session }}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            
            <Pagination class="mt-8" v-if="events" @update:page="onPageChange" v-slot="{ page }" :items-per-page="10"
                :total="events.count" :default-page="currentPage">
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