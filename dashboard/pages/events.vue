<script lang="ts" setup>
import EventsFunnelChart from '~/components/events/EventsFunnelChart.vue';
import DateService, { type Slice } from '@services/DateService';

definePageMeta({ layout: 'dashboard' });

const { permission, canSeeEvents } = usePermission();

const { snapshotDuration } = useSnapshot();

const selectedLabelIndex = ref<number>(1);

const selectLabels: { label: string, value: Slice }[] = [
    { label: 'Hour', value: 'hour' },
    { label: 'Day', value: 'day' },
    { label: 'Month', value: 'month' },
];

const selectLabelsAvailable = computed<{ label: string, value: Slice, disabled: boolean }[]>(() => {
    return selectLabels.map(e => {
        return { ...e, disabled: !DateService.canUseSliceFromDays(snapshotDuration.value, e.value)[0] }
    });
})

const eventsData = await useFetch(`/api/data/count`, {
    headers: useComputedHeaders({ custom: { 'x-schema': 'events' } }),
    lazy: true
});

</script>


<template>

    <div v-if="!canSeeEvents" class="h-full w-full flex mt-[20vh] justify-center">
        <div> You need events permission to view this page </div>
    </div>

    <div v-if="canSeeEvents" class="w-full h-full overflow-y-auto pb-20 p-6 gap-6 flex flex-col">


        <LyxUiCard class="w-full flex justify-between items-center lg:flex-row flex-col gap-6 lg:gap-0">
            <div class="flex flex-col gap-1">
                <div>
                    Total events: {{ eventsData.data.value?.[0]?.count || '0' }}
                </div>
            </div>
            <div>
                <LyxUiButton type="secondary" target="_blank" to="https://docs.litlyx.com/custom-events">
                    Trigger your first event
                </LyxUiButton>
            </div>
        </LyxUiCard>


        <div>
            <BarCardEvents :key="refreshKey"></BarCardEvents>
        </div>

        <div class="flex gap-6 flex-col xl:flex-row xl:h-full">

            <CardTitled :key="refreshKey" class="p-4 xl:flex-[4] w-full h-full" title="Events"
                sub="Events stacked bar chart.">
                <template #header>

                    <SelectButton class="w-fit" @changeIndex="selectedLabelIndex = $event"
                        :currentIndex="selectedLabelIndex" :options="selectLabelsAvailable">
                    </SelectButton>

                </template>
                <div class="h-full">
                    <EventsStackedBarChart :slice="(selectLabelsAvailable[selectedLabelIndex].value as any)">
                    </EventsStackedBarChart>
                </div>
            </CardTitled>

            <CardTitled :key="refreshKey" class="p-4 xl:flex-[2] w-full h-full" title="Top events"
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