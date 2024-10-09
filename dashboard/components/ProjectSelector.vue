<script lang="ts" setup>

import type { TProject } from '@schema/ProjectSchema';

const { user } = useLoggedUser()

const { projectList, guestProjectList,allProjectList, actions, project } = useProject();


function isProjectMine(owner?: string) {
    if (!owner) return false;
    if (!user.value) return false;
    if (!user.value.logged) return;
    return user.value.id == owner;
}

function onChange(e: TProject) {
    actions.setActiveProject(e._id.toString());
}
</script>

<template>

    <USelectMenu :uiMenu="{
        select: '!bg-lyx-widget-light !shadow-none focus:!ring-lyx-widget-lighter !ring-lyx-widget-lighter',
        base: '!bg-lyx-widget',
        option: {
            base: 'hover:!bg-lyx-widget-lighter cursor-pointer',
            active: '!bg-lyx-widget-lighter'
        }
    }" class="w-full" v-if="allProjectList" @change="onChange" :value="project" :options="allProjectList">

        <template #option="{ option, active, selected }">
            <div class="flex items-center gap-2">
                <div>
                    <img class="h-5 bg-black rounded-full" :src="'/logo_32.png'" alt="Litlyx logo">
                </div>
                <div> {{ option.name }} {{ !isProjectMine(option.owner) ? '(Guest)' : '' }}</div>
            </div>
        </template>

        <template #label>
            <div class="flex items-center gap-2">
                <div>
                    <img class="h-5 bg-black rounded-full" :src="'/logo_32.png'" alt="Litlyx logo">
                </div>
                <div>
                    {{ project?.name || '-' }}
                    {{ !isProjectMine(project?.owner?.toString()) ? '(Guest)' : '' }}
                </div>
            </div>
        </template>
    </USelectMenu>

</template>