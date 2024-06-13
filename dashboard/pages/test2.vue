<script lang="ts" setup>

definePageMeta({ layout: 'dashboard' });

const activeProject = useActiveProject();


const eventNames = ref<string[]>([]);

onMounted(async () => {
    eventNames.value = await $fetch<string[]>(`/api/metrics/${activeProject.value?._id.toString()}/events/names`, signHeaders());
});

function test() {
    const res = $fetch(`/api/metrics/${activeProject.value?._id.toString()}/events/flow_from_name?name=ToggleFavorite`, signHeaders());
    console.log(res);
}

</script>


<template>
    <div class="w-full h-full p-8 flex flex-col">



        <CardTitled title="FLOW" sub="owo" class="w-full p-4">
            <div class="p-2 flex flex-col">

                <button @click="test">
                    TEST
                </button>

            </div>
        </CardTitled>

        <div class="mt-8 overflow-y-auto px-4 flex flex-col gap-3">

        </div>


    </div>
</template>