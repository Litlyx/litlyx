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
            <CardTitled class="p-4 flex-[4]" title="Events" sub="Events stacked bar chart.">
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

            <div class="bg-card p-4 rounded-xl flex-[2] flex flex-col gap-10 h-full">
                <div class="flex flex-col gap-1">
                    <div class="poppins font-semibold text-[1.4rem] text-text">
                        Top events
                    </div>
                    <div class="poppins text-[1rem] text-text-sub/90">
                        Displays key events.
                    </div>
                </div>

                <DashboardEventsChart class="w-full"> </DashboardEventsChart>

            </div>
        </div>

        <div class="flex">
            <EventsUserFlow></EventsUserFlow>
        </div>

        <div class="flex">
            <EventsMetadataAnalyzer></EventsMetadataAnalyzer>
        </div>



    </div>
</template>