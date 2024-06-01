<script lang="ts" setup>

definePageMeta({ layout: 'dashboard' });

const selectLabels = [
    { label: 'Day', value: 'day' },
    { label: 'Month', value: 'month' },
];

const activeProject = useActiveProject();

// const { data: names } = useFetch(`/api/metrics/${activeProject.value?._id.toString()}/events/names`, signHeaders());

const eventsStackedSelectIndex = ref<number>(0);


const text = ref<string>("");
const response = ref<string>("");
const loading = ref<boolean>(false);

async function ask() {
    if (loading.value) return;
    if (!activeProject.value) return;
    loading.value = true;
    response.value = '';
    const res = await $fetch(`/api/ai/${activeProject.value._id.toString()}/ask`, {
        method: 'POST',
        body: JSON.stringify({ text: text.value }),
        ...signHeaders({ 'Content-Type': 'application/json' })
    });
    text.value = '';
    loading.value = false;
    response.value = res || 'NO_RESPONSE';
}


const { isAdmin } = useUserRoles();

</script>

<template>

    <div class="w-full h-full p-6">

        <CardTitled class="p-4 flex-1" title="Events" sub="Events stacked bar chart.">
            <template #header>
                <SelectButton @changeIndex="eventsStackedSelectIndex = $event" :currentIndex="eventsStackedSelectIndex"
                    :options="selectLabels">
                </SelectButton>
            </template>
            <div>
                <EventsStackedBarChart :slice="(selectLabels[eventsStackedSelectIndex].value as any)">
                </EventsStackedBarChart>
            </div>
        </CardTitled>

        <div class="p-4 text-[1.3rem] flex flex-col gap-4" v-if="isAdmin">
            <div class="flex gap-8">
                <input class="w-full p-4 px-8 poppins rounded-full" type="text" v-model="text">
                <div class="bg-menu py-2 px-10 flex items-center rounded-lg cursor-pointer hover:bg-menu/80"
                    @click="ask()">
                    {{ loading ? 'Loading' : 'Send' }}
                </div>
            </div>
            <div v-if="response">
                {{ response }}
            </div>
        </div>

        <!-- 
        <div>
            <br>
            <br>
            <div> Event names:</div>
            <br>
            <div v-for="name of names">
                {{ name }}
            </div>
        </div> -->

        <!-- <div class="flex w-full gap-6 flex-col xl:flex-row">
                <div class="flex-1">
                   
                    <div class="bg-menu p-6 rounded-xl flex flex-col gap-6">
                        <div class="poppins font-semibold text-[1.1rem]">
                            Manage your events
                        </div>
                        <div class="w-full">
                            <DashboardEventsColorManager></DashboardEventsColorManager>
                        </div>
                    </div>

                </div>
                <div class="flex-1">
                    <DashboardEventsBarCard></DashboardEventsBarCard>
                </div>
            </div> -->


    </div>

</template>