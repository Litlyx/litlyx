<script lang="ts" setup>
import EventsFunnelChart from '~/components/events/EventsFunnelChart.vue';


definePageMeta({ layout: 'dashboard' });

const selectLabelsEvents = [
    { label: 'Day', value: 'day' },
    { label: 'Month', value: 'month' },
];
const eventsStackedSelectIndex = ref<number>(0);

const activeProject = useActiveProject();
const { snapshot, safeSnapshotDates } = useSnapshot();

const refreshKey = computed(() => `${snapshot.value._id.toString() + activeProject.value?._id.toString()}`);



const headers = computed(() => {
    return {
        'x-from': safeSnapshotDates.value.from,
        'x-to': safeSnapshotDates.value.to,
        'Authorization': authorizationHeaderComputed.value,
        'x-schema': 'events',
        'x-pid': activeProject.value?._id.toString() || ''
    }
});

const eventsData = await useFetch(`/api/data/count`, { method: 'POST', headers, lazy: true });

</script>


<template>
    <div class="w-full h-full overflow-y-auto pb-20 p-6 gap-6 flex flex-col">


        <LyxUiCard class="w-full flex justify-between items-center">
            <div class="flex flex-col gap-1">
                <div>
                    Total events: {{ eventsData.data.value?.[0]?.total || '0' }}
                </div>
                <div v-if="(eventsData.data.value?.[0]?.total || 0) === 0">
                    Waiting for your first event...
                </div>
            </div>
            <div>
                <LyxUiButton type="secondary" to="https://docs.litlyx.com/custom-events">
                    Go to docs
                </LyxUiButton>
            </div>
        </LyxUiCard>

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