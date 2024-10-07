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

        <div class="p-2 flex flex-col gap-3">
            <USelectMenu searchable searchable-placeholder="Search an event..." class="w-full"
                placeholder="Select an event" :options="eventNames.data.value || []" v-model="selectedEventName">
            </USelectMenu>
            <div v-if="selectedEventName && !analyzing" class="flex justify-center">
                <div @click="analyzeEvent()"
                    class="bg-bg w-fit px-8 py-2 poppins rounded-lg hover:bg-bg/80 cursor-pointer">
                    Analyze
                </div>
            </div>

            <div v-if="analyzing">
                Analyzing...
            </div>

            <div class="flex flex-col gap-2" v-if="userFlowData">
                <div class="flex gap-4 items-center bg-bg py-1 px-2 rounded-lg"
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