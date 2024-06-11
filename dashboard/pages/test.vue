<script lang="ts" setup>

definePageMeta({ layout: 'dashboard' });

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

async function getMetadataFields() {
    metadataFields.value = await $fetch<string[]>(`/api/metrics/${activeProject.value?._id.toString()}/events/metadata_fields?name=${selectedEventName.value}`, signHeaders());
    selectedMetadataField.value = undefined;
}

async function getMetadataFieldGrouped() {
    metadataFieldGrouped.value = await $fetch<string[]>(`/api/metrics/${activeProject.value?._id.toString()}/events/metadata_field_group?name=${selectedEventName.value}&field=${selectedMetadataField.value}`, signHeaders());
}


</script>


<template>
    <div class="w-full h-full p-8 flex">



        <CardTitled title="Event tracker" sub="Track users from you marketing links to inner events" class="w-full">

            <div class="p-8">

                <div class="flex flex-col gap-2">
                    <USelectMenu searchable searchable-placeholder="Search an event..." class="w-full"
                        placeholder="Select an event" :options="eventNames" v-model="selectedEventName">
                    </USelectMenu>

                    <USelectMenu v-if="metadataFields.length > 0" searchable searchable-placeholder="Search a field..."
                        class="w-full" placeholder="Select a field" :options="metadataFields"
                        v-model="selectedMetadataField">
                    </USelectMenu>
                </div>

                <div @click="getMetadataFieldGrouped()"
                    class="bg-black/70 p-2 px-8 w-fit rounded-lg mt-4 hover:bg-black/40 cursor-pointer">
                    Find
                </div>

                <div>
                    {{ metadataFieldGrouped }}
                </div>

            </div>
        </CardTitled>

    </div>
</template>