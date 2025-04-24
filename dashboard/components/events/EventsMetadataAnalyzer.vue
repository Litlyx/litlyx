<script lang="ts" setup>


const eventNames = await useFetch<string[]>(`/api/data/events_data/names`, {
    headers: useComputedHeaders()
});

const selectedEventName = ref<string>();
const metadataFields = ref<string[]>([]);
const selectedMetadataField = ref<string>();
const metadataFieldGrouped = ref<any[]>([]);


watch(selectedEventName, () => {
    getMetadataFields();
});

watch(selectedMetadataField, () => {
    getMetadataFieldGrouped();
});

async function getMetadataFields() {
    metadataFields.value = await $fetch<string[]>(`/api/data/events_data/metadata_fields?name=${selectedEventName.value}`, {
        headers: useComputedHeaders().value
    });
    selectedMetadataField.value = undefined;
    currentSearchText.value = "";
}

const { safeSnapshotDates } = useSnapshot();

async function getMetadataFieldGrouped() {
    if (!selectedMetadataField.value) return;


    const queryParams: Record<string, any> = {
        from: safeSnapshotDates.value.from,
        to: safeSnapshotDates.value.to,
        name: selectedEventName.value,
        field: selectedMetadataField.value
    }

    const queryParamsString = Object.keys(queryParams).map((key) => `${key}=${queryParams[key]}`).join('&');

    metadataFieldGrouped.value = await $fetch<string[]>(`/api/data/events_data/metadata_field_group?${queryParamsString}`, {
        headers: useComputedHeaders().value
    });
}




const metadataFieldGroupedFiltered = computed(() => {
    if (currentSearchText.value.length == 0) return metadataFieldGrouped.value;
    return metadataFieldGrouped.value.filter(e => {
        const currentId: string = e._id || '';
        const idToMatch = currentId.toLowerCase();
        return idToMatch.includes(currentSearchText.value.toLowerCase());
    });
});

const currentSearchText = ref<string>("");

const canSearch = computed(() => {
    return selectedMetadataField.value != undefined;
});



</script>

<template>


    <CardTitled title="Analyze event metadata" sub="Filter events metadata fields to analyze them" class="w-full p-4">

        <div class="">

            <LyxUiCard class="h-full w-full flex gap-2">

                <div class="flex-[2]">
                    <div class="flex flex-col gap-2">
                        <USelectMenu :uiMenu="{
                            select: 'bg-lyx-lightmode-widget-light !ring-lyx-lightmode-widget dark:!bg-lyx-widget-light !shadow-none focus:!ring-lyx-widget-lighter dark:!ring-lyx-widget-lighter',
                            base: '!bg-lyx-lightmode-widget dark:!bg-lyx-widget',
                            option: {
                                base: 'hover:!bg-lyx-lightmode-widget-light dark:hover:!bg-lyx-widget-lighter cursor-pointer',
                                active: '!bg-lyx-lightmode-widget-light dark:!bg-lyx-widget-lighter'
                            }
                        }" searchable searchable-placeholder="Search an event..." class="w-full"
                            placeholder="Select an event" :options="eventNames.data.value || []"
                            v-model="selectedEventName">
                        </USelectMenu>

                        <USelectMenu :uiMenu="{
                            select: 'bg-lyx-lightmode-widget-light !ring-lyx-lightmode-widget dark:!bg-lyx-widget-light !shadow-none focus:!ring-lyx-widget-lighter dark:!ring-lyx-widget-lighter',
                            base: '!bg-lyx-lightmode-widget dark:!bg-lyx-widget',
                            option: {
                                base: 'hover:!bg-lyx-lightmode-widget-light dark:hover:!bg-lyx-widget-lighter cursor-pointer',
                                active: '!bg-lyx-lightmode-widget-light dark:!bg-lyx-widget-lighter'
                            }
                        }" searchable searchable-placeholder="Search a field..." class="w-full"
                            placeholder="Select a field" :options="metadataFields" v-model="selectedMetadataField">
                        </USelectMenu>
                    </div>

                    <div class="text-lyx-text-darker poppins mt-4 flex items-center gap-4 lg:flex-row flex-col">
                        <div class="w-[10rem]">
                            Search results: {{ metadataFieldGroupedFiltered.length }}
                        </div>
                        <div v-if="canSearch" class="h-full flex items-center text-[1.2rem]">

                            <div class="bg-lyx-lightmode-widget dark:bg-lyx-widget-light flex items-center rounded-md pl-4">
                                <div><i class="far fa-search"></i></div>
                                <input class="bg-transparent px-4 py-2 text-[1rem] outline-none" type="text"
                                    placeholder="Filter by metadata name" v-model="currentSearchText">
                            </div>

                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2 lg:mt-4 mt-10">

                        <div class="bg-lyx-lightmode-widget dark:bg-lyx-widget-light text-lyx-lightmode-text dark:text-lyx-text-dark px-3 py-2 rounded-md w-fit"
                            v-for="item of metadataFieldGroupedFiltered">
                            <div class="flex gap-2 items-center">
                                <div> {{ item._id || 'OLD_EVENTS' }} </div>
                                <div class="px-1"> {{ item.count }} </div>
                            </div>
                        </div>

                    </div>

                </div>

                <!-- <div class="border-solid border-[#212121] border-l-[1px]"></div> -->

                <!-- <div class="flex-[1]">
                    <div class="poppins font-semibold"> </div>
                </div> -->

            </LyxUiCard>

        </div>

        <!-- <div class="p-2 flex flex-col">

            <div class="flex flex-col gap-2">
                <USelectMenu searchable searchable-placeholder="Search an event..." class="w-full"
                    placeholder="Select an event" :options="eventNames.data.value || []" v-model="selectedEventName">
                </USelectMenu>

                <USelectMenu v-if="metadataFields.length > 0" searchable searchable-placeholder="Search a field..."
                    class="w-full" placeholder="Select a field" :options="metadataFields"
                    v-model="selectedMetadataField">
                </USelectMenu>
            </div>

            <div v-if="canSearch" class="flex gap-4 mt-4 items-center">
                <div> Filter by name: </div>
                <div class="h-full flex items-center text-[1.2rem]">
                    <input v-model="currentSearchText"
                        class="bg-black/70 hover:bg-black/40 rounded-lg px-4 py-1 focus:outline-none" type="text">
                </div>

            </div>


            <div class="mt-8 overflow-y-auto px-4 flex flex-col gap-3">

                <div class="text-accent poppins font-semibold">
                    Search results: {{ metadataFieldGroupedFiltered.length }}
                </div>

   
            </div>

        </div> -->

    </CardTitled>


</template>