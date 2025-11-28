<script setup lang="ts">
import { GalleryVerticalEnd, TriangleAlert, Layers2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const route = useRoute();
const router = useRouter();

if (route.query.first !== 'true') {
    setPageLayout('sidebar');
}

const projectStore = useProjectStore();

const projectName = ref<string>();

const canCreate = computed(() => {
    if (creating.value) return false;
    return projectName.value && projectName.value.length > 2 && projectName.value.length < 24;
});

const creating = ref<boolean>(false);

const { loadData } = useAppStart();

async function createProject() {

    if (creating.value) return;
    creating.value = true;

    await useCatch({
        toast: true,
        toastTitle: 'Error creating project',
        async action() {
            return await useAuthFetchSync('/api/project/create', {
                method: 'POST',
                body: { name: projectName.value }
            });
        },
        async onSuccess(data, showToast) {
            if (route.query.first === 'true') await loadData();
            await projectStore.fetchProjects();
            const target = projectStore.projects.at(-1)?._id.toString();
            if (target) await projectStore.setActive(target);
            router.push('/');
            showToast("Success", { description: 'Workspace successfully created' })
        },
    });

    creating.value = false;

}

</script>

<template>
    <div class="flex flex-col items-center gap-6">


        <div class="flex flex-col items-center gap-2 mt-[20vh]">
            <div class="flex flex-col items-center gap-2 font-medium">
                <div class="flex size-8 items-center justify-center rounded-md">
                    <Layers2 class="size-8" />
                </div>
            </div>
            <h1 class="text-xl font-bold">
                {{ route.query.first === 'true' ? 'Create your first Workspace':'Create new Workspace' }}
            </h1>
        </div>

        <div class="max-w-[80vw] w-[20rem] flex flex-col items-center gap-4">
            <Input v-model="projectName" placeholder="Workspace name"></Input>
            <Button @click="createProject()" :disabled="!canCreate" class="w-full"> Create </Button>
        </div>

    </div>
</template>
