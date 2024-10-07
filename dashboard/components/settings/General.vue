<script lang="ts" setup>
import type { TApiSettings } from '@schema/ApiSettingsSchema';
import type { SettingsTemplateEntry } from './Template.vue';

const { project, actions, projectList } = useProject();

const entries: SettingsTemplateEntry[] = [
    { id: 'pname', title: 'Name', text: 'Project name' },
    { id: 'api', title: 'ApiKeys', text: 'Manage your authorization token' },
    { id: 'pid', title: 'Id', text: 'Project id' },
    { id: 'pscript', title: 'Script', text: 'Universal javascript integration' },
    { id: 'pdelete', title: 'Delete', text: 'Delete current project' },
]

const projectNameInputVal = ref<string>(project.value?.name || '');

const apiKeys = ref<TApiSettings[]>([]);

const newApiKeyName = ref<string>('');

async function updateApiKeys() {
    newApiKeyName.value = '';
    apiKeys.value = await $fetch<TApiSettings[]>('/api/keys/get_all', signHeaders({
        'x-pid': project.value?._id.toString() ?? ''
    }));
}

async function createApiKey() {
    try {
        const res = await $fetch<TApiSettings>('/api/keys/create', {
            method: 'POST', ...signHeaders({
                'Content-Type': 'application/json',
                'x-pid': project.value?._id.toString() ?? ''
            }),
            body: JSON.stringify({ name: newApiKeyName.value })
        });
        apiKeys.value.push(res);
        newApiKeyName.value = '';
    } catch (ex: any) {
        alert(ex.message);
    }
}

async function deleteApiKey(api_id: string) {
    try {
        const res = await $fetch<TApiSettings>('/api/keys/delete', {
            method: 'DELETE', ...signHeaders({
                'Content-Type': 'application/json',
                'x-pid': project.value?._id.toString() ?? ''
            }),
            body: JSON.stringify({ api_id })
        });
        newApiKeyName.value = '';
        await updateApiKeys();
    } catch (ex: any) {
        alert(ex.message);
    }

}

onMounted(() => {
    updateApiKeys();
});

watch(project, () => {
    projectNameInputVal.value = project.value?.name || "";
    updateApiKeys();
});

const canChange = computed(() => {
    if (project.value?.name == projectNameInputVal.value) return false;
    if (projectNameInputVal.value.length === 0) return false;
    return true;
});


async function changeProjectName() {
    await $fetch("/api/project/change_name", {
        method: 'POST',
        ...signHeaders({
            'Content-Type': 'application/json',
            'x-pid': project.value?._id.toString() ?? ''
        }),
        body: JSON.stringify({ name: projectNameInputVal.value })
    });
    location.reload();
}

async function deleteProject() {
    if (!project.value) return;
    const sure = confirm(`Are you sure to delete the project ${project.value.name} ?`);
    if (!sure) return;

    try {

        await $fetch('/api/project/delete', {
            method: 'DELETE',
            ...signHeaders({
                'Content-Type': 'application/json',
                'x-pid': project.value?._id.toString() ?? ''
            }),
            body: JSON.stringify({ project_id: project.value._id.toString() })
        });


        await actions.refreshProjectsList()

        const firstProjectId = projectList.value?.[0]?._id.toString();
        if (firstProjectId) {
            await setActiveProject(firstProjectId);
        }


    } catch (ex: any) {
        alert(ex.message);
    }


}

const { createAlert } = useAlert()

const activeProjectId = useActiveProjectId()

function copyScript() {
    if (!navigator.clipboard) alert('You can\'t copy in HTTP');


    const createScriptText = () => {
        return [
            '<script defer ',
            `data-project="${activeProjectId.data.value}" `,
            'src="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js"></',
            'script>'
        ].join('')
    }

    navigator.clipboard.writeText(createScriptText());
    createAlert('Success', 'Script copied successfully.', 'far fa-circle-check', 5000);
}


function copyProjectId() {
    if (!navigator.clipboard) alert('You can\'t copy in HTTP');
    navigator.clipboard.writeText(activeProjectId.data.value || '');
    createAlert('Success', 'Project id copied successfully.', 'far fa-circle-check', 5000);
}



</script>


<template>
    <SettingsTemplate :entries="entries" :key="project?.name || 'NONE'">
        <template #pname>
            <div class="flex items-center gap-4">
                <LyxUiInput class="w-full px-4 py-2" v-model="projectNameInputVal"></LyxUiInput>
                <LyxUiButton v-if="!isGuest" @click="changeProjectName()" :disabled="!canChange" type="primary"> Change
                </LyxUiButton>
            </div>
        </template>
        <template #api>
            <div class="flex items-center gap-4" v-if="apiKeys && apiKeys.length < 5">
                <LyxUiInput class="grow px-4 py-2" placeholder="ApiKeyName" v-model="newApiKeyName"></LyxUiInput>
                <LyxUiButton v-if="!isGuest" @click="createApiKey()" :disabled="newApiKeyName.length < 3"
                    type="primary">
                    <i class="far fa-plus"></i>
                </LyxUiButton>
            </div>
            <LyxUiCard v-if="apiKeys && apiKeys.length > 0" class="w-full flex flex-col gap-4 items-center mt-4">
                <div v-for="apiKey of apiKeys" class="flex flex-col w-full">

                    <div class="flex gap-8 items-center">
                        <div class="grow">Name: {{ apiKey.apiName }}</div>
                        <div>{{ apiKey.apiKey }}</div>
                        <div class="flex justify-end">
                            <i class="far fa-trash cursor-pointer" @click="deleteApiKey(apiKey._id.toString())"></i>
                        </div>
                    </div>

                </div>
            </LyxUiCard>
        </template>
        <template #pid>
            <LyxUiCard class="w-full flex items-center">
                <div class="grow">{{ project?._id.toString() }}</div>
                <div><i class="far fa-copy" @click="copyProjectId()"></i></div>
            </LyxUiCard>
        </template>
        <template #pscript>
            <LyxUiCard class="w-full flex items-center">
                <div class="grow">
                    {{ `
                    <script defer data-project="${project?._id}"
                        src="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js"></script>` }}
                </div>
                <div><i class="far fa-copy" @click="copyScript()"></i></div>
            </LyxUiCard>
        </template>
        <template #pdelete>
            <div class="flex justify-end" v-if="!isGuest">
                <LyxUiButton type="danger" @click="deleteProject()">
                    Delete project
                </LyxUiButton>
            </div>
        </template>
    </SettingsTemplate>
</template>
