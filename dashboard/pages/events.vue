<script lang="ts" setup>
import EventsFunnelChart from '~/components/events/EventsFunnelChart.vue';


definePageMeta({ layout: 'dashboard' });

const selectLabelsEvents = [
    { label: 'Day', value: 'day' },
    { label: 'Month', value: 'month' },
];
const eventsStackedSelectIndex = ref<number>(0);

const eventsData = await useFetch(`/api/data/count`, { headers: useComputedHeaders({ custom: { 'x-schema': 'events' } }), lazy: true });

</script>


<template>
    <div class="w-full h-full overflow-y-auto pb-20 p-6 gap-6 flex flex-col">


        <LyxUiCard class="w-full flex justify-between items-center">
            <div class="flex flex-col gap-1">
                <div>
                    Total events: {{ eventsData.data.value?.[0]?.count || '0' }}
                </div>
                <div v-if="(eventsData.data.value?.[0]?.count || 0) === 0">
                    Waiting for your first event...
                </div>
            </div>
            <div>
                <LyxUiButton type="secondary" to="https://docs.litlyx.com/custom-events">
                    Trigger your first event
                </LyxUiButton>
            </div>
        </LyxUiCard>


        <div>
            <BarCardEvents :key="refreshKey"></BarCardEvents>
        </div>

        <div class="flex gap-6 flex-col xl:flex-row h-full">

            <CardTitled :key="refreshKey" class="p-4 flex-[4] w-full h-full" title="Events"
                sub="Events stacked bar chart.">
                <template #header>
                    <SelectButton @changeIndex="eventsStackedSelectIndex = $event"
                        :currentIndex="eventsStackedSelectIndex" :options="selectLabelsEvents">
                    </SelectButton>
                </template>
                <div class="h-full">
                    <EventsStackedBarChart :slice="(selectLabelsEvents[eventsStackedSelectIndex].value as any)">
                    </EventsStackedBarChart>
                </div>
            </CardTitled>

            <CardTitled :key="refreshKey" class="p-4 flex-[2] w-full h-full" title="Top events"
                sub="Displays key events.">
                <DashboardEventsChart class="w-full"> </DashboardEventsChart>
            </CardTitled>

        </div>



        <div class="flex">
            <EventsFunnelChart :key="refreshKey" class="w-full"></EventsFunnelChart>
        </div>



        <div class="flex">
            <EventsUserFlow :key="refreshKey"></EventsUserFlow>
        </div>


        <div class="flex">
            <EventsMetadataAnalyzer :key="refreshKey"></EventsMetadataAnalyzer>
        </div>



    </div>
</template>