<script lang="ts" setup>

const eventNames = await useFetch<string[]>(`/api/data/events_data/names`, {
    headers: useComputedHeaders()
});

const selectedEventName = ref<string>();


const userFlowData = ref<any>();
const analyzing = ref<boolean>(false);

const { safeSnapshotDates } = useSnapshot();

async function getUserFlowData() {
    userFlowData.value = undefined;
    analyzing.value = true;

    const queryParams: Record<string, any> = {
        from: safeSnapshotDates.value.from,
        to: safeSnapshotDates.value.to,
        name: selectedEventName.value
    }

    const queryParamsString = Object.keys(queryParams).map((key) => `${key}=${queryParams[key]}`).join('&');

    userFlowData.value = await $fetch(`/api/data/events_data/flow_from_name?${queryParamsString}`, {
        headers: useComputedHeaders().value
    });

    analyzing.value = false;
}

async function analyzeEvent() {
    getUserFlowData();
}

</script>

<template>
    <CardTitled title="Event User Flow"
        sub="Track your user's journey from external links to in-app events, maintaining a complete view of their path from entry to engagement."
        class="w-full p-4">

        <div class="flex flex-col gap-4">

            <div class="py-2 flex items-center gap-3">
                <USelectMenu :uiMenu="{
                    select: '!bg-lyx-widget-light !shadow-none focus:!ring-lyx-widget-lighter !ring-lyx-widget-lighter',
                    base: '!bg-lyx-widget',
                    option: {
                        base: 'hover:!bg-lyx-widget-lighter cursor-pointer',
                        active: '!bg-lyx-widget-lighter'
                    }
                }" searchable searchable-placeholder="Search an event..." class="w-full" placeholder="Select an event"
                    :options="eventNames.data.value || []" v-model="selectedEventName">
                </USelectMenu>
                <div v-if="selectedEventName && !analyzing" class="flex justify-center">
                    <LyxUiButton @click="analyzeEvent()" type="primary" class="w-fit px-8 py-1">
                        Analyze
                    </LyxUiButton>
                </div>
            </div>

            <div v-if="analyzing">
                <div
                    class="backdrop-blur-[1px] z-[20] w-full h-full flex items-center justify-center font-bold rockmann">
                    <i
                        class="fas fa-spinner text-[2rem] text-accent animate-[spin_1s_linear_infinite] duration-500"></i>
                </div>
            </div>

            <div class="flex flex-col gap-2" v-if="userFlowData">
                <div class="flex gap-4 items-center bg-bg py-2 px-2 bg-lyx-widget-light rounded-lg"
                    v-for="(count, referrer) in userFlowData">
                    <div class="w-5 h-5 flex items-center justify-center">
                        <img :src="`https://s2.googleusercontent.com/s2/favicons?domain=${referrer}&sz=64`"
                            :alt="'referrer'">
                    </div>
                    <div> {{ referrer }} </div>
                    <div class="grow"></div>
                    <div> {{ count.toFixed(2).replace('.', ',') }} % </div>
                </div>
            </div>
        </div>


    </CardTitled>
</template>