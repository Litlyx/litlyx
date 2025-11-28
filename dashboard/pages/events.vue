<script lang="ts" setup>

import EventsStackedChart from '~/components/complex/EventsStackedChart.vue';
import EventDoughnutChart from '~/components/complex/EventDoughnutChart.vue';
import EventsUserFlow from '~/components/complex/EventsUserFlow.vue';
import EventsMetadataAnalyzer from '~/components/complex/EventsMetadataAnalyzer.vue';
import EventsFunnelChart from '~/components/complex/EventsFunnelChart.vue';
import LineDataNew from '~/components/complex/LineDataNew.vue';

definePageMeta({ layout: 'sidebar' });

const { data: events } = useAuthFetch<{ _id: string, count: number }[]>('/api/data/events', { headers: { 'x-limit': '9999999' } });

const { permissions } = useProjectStore();

</script>

<template>

    <Unauthorized v-if="permissions?.events === false" authorization="Guest user limitation Events">
    </Unauthorized>

    <div v-else class="flex flex-col gap-4 poppins">
        <div class="bg-gradient-to-r from-violet-500/20 to-transparent rounded-md">
            <div class=" m-[1px] p-4 rounded-md flex justify-between">
                <div class="flex items-center">
                    <div>
                        <Badge class="h-8 bg-gray-100 dark:bg-white/20 text-black dark:text-white text-md font-normal">
                            <span v-if="events">Total events: {{events.reduce((a, e) => a + e.count, 0)}}</span>
                            <Loader v-else class="h-8" />
                        </Badge>
                    </div>
                </div>
                <div class="flex gap-4">
                    <NuxtLink to="/raw_events"><Button variant="outline">Raw Data</Button></NuxtLink>
                    <NuxtLink to="https://docs.litlyx.com/custom-events" target="_blank">
                        <Button> Trigger your first event </Button>
                    </NuxtLink>
                </div>

            </div>
        </div>

        <div class="flex flex-col xl:flex-row xl:h-full gap-4">
            <LineDataNew class="xl:flex-[4]" type="events" />
            <EventDoughnutChart class="p-4 xl:flex-[2] w-full h-full"></EventDoughnutChart>
        </div>

        <div class="flex">
            <EventsStackedChart class="w-full"></EventsStackedChart>
        </div>


        <div class="flex">
            <EventsFunnelChart></EventsFunnelChart>
        </div>



        <div class="flex">
            <EventsUserFlow></EventsUserFlow>
        </div>

        <div class="flex">
            <EventsMetadataAnalyzer></EventsMetadataAnalyzer>
        </div>

    </div>
</template>