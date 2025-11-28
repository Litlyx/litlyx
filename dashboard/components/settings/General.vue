<script setup lang="ts">
import { toast } from 'vue-sonner';
import { CopyIcon, LoaderCircle, Trash } from 'lucide-vue-next';
import DeleteProject from '../dialog/DeleteProject.vue';

const projectStore = useProjectStore();

const { open } = useDialog();

const router = useRouter();

const currentProjectName = ref<string>(projectStore.activeProject?.name ?? 'ERROR_LOADING_PROJECT_NAME');

const scriptValue = [
    '<',
    'script defer data-workspace="',
    projectStore.activeProject?._id.toString(),
    '" src="https://cdn.jsdelivr.net/npm/litlyx-js@latest/browser/litlyx.js"></',
    'script>'
]


function copyProjectId() {
    if (!navigator.clipboard) return toast('Error', { position: 'top-right', description: 'Error copying' });
    navigator.clipboard.writeText(projectStore.activeProject?._id.toString() ?? 'ERROR_COPYING_WORKSPACE_ID');
    return toast.info('Success', { position: 'top-right', description: 'The workspace id has been copied to your clipboard' });
}

function copyScript() {
    if (!navigator.clipboard) return toast('Error', { position: 'top-right', description: 'Error copying' });
    navigator.clipboard.writeText(scriptValue.join(''));
    return toast.info('Success', { position: 'top-right', description: 'The workspace script has been copied to your clipboard' });
}

const changing = ref<boolean>(false);

async function changeProjectName() {
    changing.value = true;
    await new Promise(e => setTimeout(e, 1000));
    await useCatch({
        toast: true,
        toastTitle: 'Error changing name',
        async action() {
            await useAuthFetchSync('/api/project/change_name', {
                method: 'POST',
                headers: { 'ContentType': 'application/json' },
                body: { name: currentProjectName.value }
            })
        },
        async onSuccess(_, showToast) {
            showToast('Name changed', { position: 'top-right', description: 'Workspace name changed' });
            await projectStore.fetchProjects();
            currentProjectName.value = projectStore.activeProject?.name ?? 'ERROR_LOADING_WORKSPACE_NAME'
        },
    })
    changing.value = false;
}


async function showDeleteProjectDialog() {
    if (!projectStore.pid) return;
    if (!projectStore.activeProject) return;
    await open({
        body: DeleteProject,
        title: 'Delete workspace',
        props: {
            project_id: projectStore.pid,
            project_name: projectStore.activeProject.name
        },
        onSuccess(_, close) {
            close();
            deleteProject();
        },
    })
}

async function deleteProject() {
    await useCatch({
        toast: true,
        toastTitle: 'Error during deletation',
        async action() {
            await useAuthFetchSync('/api/project/delete', {
                method: 'DELETE'
            })
        },
        async onSuccess(_, showToast) {
            showToast('Workspace deleted', { description: 'Workspace deleted successfully' });
            await projectStore.fetchProjects();
            router.push('/');
        },
    })
}

</script>

<template>
    <Card>
        <CardContent class="grid grid-cols-1 gap-4">

            <div class="py-4 flex flex-col gap-3">
                <Label> Workspace name </Label>
                <div class="flex gap-4 relative">
                    <Input class="poppins h-12 pr-[6.5rem]" v-model="currentProjectName"></Input>
                    <Button @click="changeProjectName()"
                        :disabled="changing || currentProjectName === projectStore.activeProject?.name"
                        class="absolute right-1.5 top-1.5 rounded">
                        <span v-if="changing">
                            <LoaderCircle class="size-5 animate-[spin_1s_ease-in-out_infinite] duration-500">
                            </LoaderCircle>
                        </span>
                        <span v-else> Change </span>
                    </Button>
                </div>
            </div>
<div class="bg-muted dark:bg-muted/40 w-full h-full rounded-md">
            <div class="p-4 flex flex-col gap-3 ">
                <Label> Workspace id </Label>
                <div class="flex gap-4 relative">
                    <Input class="poppins h-12 bg-white dark:bg-black" :default-value="projectStore.activeProject?._id.toString()" readonly></Input>
                    <Button @click="copyProjectId()"variant="ghost" class="absolute right-1.5 top-1.5">
                        <CopyIcon class="size-4"/>
                    </Button>
                </div>
            </div>

            <div class="p-4 flex flex-col gap-3">
                <Label> Script </Label>
                <div class="flex gap-4 items-center relative">
                    <Textarea class="w-full poppins resize-none bg-white dark:bg-black" :default-value="scriptValue.join('')"
                        readonly></Textarea>
                    <Button @click="copyScript()" variant="ghost" class="absolute right-1.5 top-1.5">
                        <CopyIcon class="size-4"/>
                   
                    </Button>
                </div>
            </div>
</div>




        </CardContent>

        <CardFooter>
                <Button :disabled="projectStore.projects.filter(e => !e.guest).length <= 1"
                    @click="showDeleteProjectDialog" variant="destructive">
                    <Trash></Trash>
                    Delete workspace
                </Button>
        </CardFooter>
    </Card>
</template>