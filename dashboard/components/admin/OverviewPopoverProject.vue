<script lang="ts" setup>

const props = defineProps<{ project: any }>();
const loading = ref<boolean>(true);

const domains = ref<string[]>([]);

const { list, containerProps, wrapperProps } = useVirtualList(domains, { itemHeight: 40 });

async function loadData() {
    domains.value.length = 0;
    loading.value = true;
    await useCatch({
        async action() {
            const res = await useAuthFetchSync<string[]>(`/api/admin/domains?pid=${props.project._id.toString()}`);
            return res;
        },
        async onSuccess(data) {
            domains.value = data;
        },
    })
    loading.value = false;
}

const projectStore = useProjectStore();

function stealProject() {
    projectStore.projects.push(props.project);
}

</script>

<template>
    <Popover @update:open="loadData()">
        <PopoverTrigger as-child>
            <Button variant="link">
                {{ props.project.name }} -
                {{ props.project.counts[0].visits }}
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-full h-full">

            <div class="flex flex-col w-full h-full">

                <div class="flex justify-center">
                    <Loader v-if="loading"></Loader>
                    <div v-if="!loading && domains.length == 0">No domains</div>
                </div>

                <div v-if="!loading && domains.length > 0" class="flex flex-col">

                    <div class="flex justify-center pb-2 gap-2">
                        <Button @click="stealProject()" size="sm">Steal</Button>
                        <Label> {{ domains.length }} domains</Label>
                    </div>

                    <div v-bind="containerProps" class="h-[18rem] w-[25rem]">
                        <div v-bind="wrapperProps" class="flex flex-col">
                            <div v-for="(domain, index) of list" class="!h-[40px]" :key="index">
                                <Separator v-if="index < domains.length - 1" class="my-2"></Separator>
                                <div>{{ domain.data }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PopoverContent>
    </Popover>
</template>