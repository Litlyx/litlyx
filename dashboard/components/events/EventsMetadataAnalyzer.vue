<script lang="ts" setup>

const activeProject = useActiveProject();


const eventNames = ref<string[]>([]);
const selectedEventName = ref<string>();
const metadataFields = ref<string[]>([]);
const selectedMetadataField = ref<string>();
const metadataFieldGrouped = ref<any[]>([]);

onMounted(async () => {
    eventNames.value = await $fetch<string[]>(`/api/metrics/${activeProject.value?._id.toString()}/events/names`, signHeaders());
});

watch(selectedEventName, () => {
    getMetadataFields();
});

watch(selectedMetadataField, () => {
    getMetadataFieldGrouped();
});

async function getMetadataFields() {
    metadataFields.value = await $fetch<string[]>(`/api/metrics/${activeProject.value?._id.toString()}/events/metadata_fields?name=${selectedEventName.value}`, signHeaders());
    selectedMetadataField.value = undefined;
    currentSearchText.value = "";
}

async function getMetadataFieldGrouped() {
    if (!selectedMetadataField.value) return;
    metadataFieldGrouped.value = await $fetch<string[]>(`/api/metrics/${activeProject.value?._id.toString()}/events/metadata_field_group?name=${selectedEventName.value}&field=${selectedMetadataField.value}`, signHeaders());
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


    <CardTitled title="Event metadata analyzer" sub="Filter events metadata fields to analyze them" class="w-full p-4">

        <div class="p-2 flex flex-col">

            <div class="flex flex-col gap-2">
                <USelectMenu searchable searchable-placeholder="Search an event..." class="w-full"
                    placeholder="Select an event" :options="eventNames" v-model="selectedEventName">
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

                <div class="flex flex-col">
                    <div v-for="item of metadataFieldGroupedFiltered">
                        <div class="flex gap-2">
                            <div> {{ item._id || 'OLD_EVENTS' }} </div>
                            <div> {{ item.count }} </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </CardTitled>


</template>