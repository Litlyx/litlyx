<script lang="ts" setup>

definePageMeta({ layout: 'dashboard' });

const selectLabelsEvents = [
    { label: 'Day', value: 'day' },
    { label: 'Month', value: 'month' },
];
const eventsStackedSelectIndex = ref<number>(0);


</script>


<template>
    <div class="w-full h-full overflow-y-auto pb-20 p-6 gap-6 flex flex-col">


        <div class="flex gap-6 flex-col xl:flex-row">

            <CardTitled class="p-4 flex-[4] w-full" title="Events" sub="Events stacked bar chart.">
                <template #header>
                    <SelectButton @changeIndex="eventsStackedSelectIndex = $event"
                        :currentIndex="eventsStackedSelectIndex" :options="selectLabelsEvents">
                    </SelectButton>
                </template>
                <div>
                    <EventsStackedBarChart :slice="(selectLabelsEvents[eventsStackedSelectIndex].value as any)">
                    </EventsStackedBarChart>
                </div>
            </CardTitled>

            <CardTitled class="p-4 flex-[2] w-full h-full" title="Top events" sub="Displays key events.">
                <DashboardEventsChart class="w-full"> </DashboardEventsChart>
            </CardTitled>

        </div>

        <div class="flex">
            <EventsUserFlow></EventsUserFlow>
        </div>

        <div class="flex">
            <EventsMetadataAnalyzer></EventsMetadataAnalyzer>
        </div>



    </div>
</template>