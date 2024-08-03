<script lang="ts" setup>
import type { SettingsTemplateEntry } from './Template.vue';


const entries: SettingsTemplateEntry[] = [
    { id: 'pname', title: 'Name', text: 'Project name' },
    { id: 'pid', title: 'Id', text: 'Project id' },
    { id: 'pscript', title: 'Script', text: 'Universal javascript integration' },
    { id: 'pdelete', title: 'Delete', text: 'Delete current project' },
]

const activeProject = useActiveProject();
const projectNameInputVal = ref<string>(activeProject.value?.name || '');

const canChange = computed(() => {
    if (activeProject.value?.name == projectNameInputVal.value) return false;
    if (projectNameInputVal.value.length === 0) return false;
    return true;
});


</script>


<template>
    <SettingsTemplate :entries="entries">
        <template #pname>
            <div class="flex items-center gap-4">
                <LyxUiInput class="w-full px-4 py-2" v-model="projectNameInputVal"></LyxUiInput>
                <LyxUiButton :disabled="!canChange" type="primary"> Change </LyxUiButton>
            </div>
        </template>
        <template #pid>
            <LyxUiCard class="w-full flex items-center">
                <div class="grow">{{ activeProject?._id.toString() }}</div>
                <div><i class="far fa-copy"></i></div>
            </LyxUiCard>
        </template>
        <template #pscript>
            <LyxUiCard class="w-full flex items-center">
                <div class="grow">
                    {{ `
                    <script defer data-project="${activeProject?._id}"
                        src="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js"></script>` }}
                </div>
                <div><i class="far fa-copy"></i></div>
            </LyxUiCard>
        </template>
        <template #pdelete>
            <div class="flex justify-end">
                <LyxUiButton type="danger">
                    Delete project
                </LyxUiButton>
            </div>
        </template>
    </SettingsTemplate>
</template>
