<script lang="ts" setup>

definePageMeta({ layout: 'dashboard' });

const selectLabelsEvents = [
    { label: 'Day', value: 'day' },
    { label: 'Month', value: 'month' },
];
const eventsStackedSelectIndex = ref<number>(0);

const activeProject = useActiveProject();
const { snapshot } = useSnapshot();

const refreshKey = computed(() => `${snapshot.value._id.toString() + activeProject.value?._id.toString()}`);


</script>


<template>
    <div class="w-full h-full overflow-y-auto pb-20 p-6 gap-6 flex flex-col">

        <div class="flex gap-6 flex-col xl:flex-row h-full">

            <CardTitled :key="refreshKey" class="p-4 flex-[4] w-full h-full" title="Events" sub="Events stacked bar chart.">
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
            <EventsUserFlow :key="refreshKey"></EventsUserFlow>
        </div>

        <div class="flex">
            <EventsMetadataAnalyzer :key="refreshKey"></EventsMetadataAnalyzer>
        </div>



    </div>
</template>