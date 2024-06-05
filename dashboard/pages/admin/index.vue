<script setup lang="ts">

import type { AdminProjectsList } from '~/server/api/admin/projects';

definePageMeta({ layout: 'dashboard' });

const { data: projects } = await useFetch<AdminProjectsList[]>('/api/admin/projects', signHeaders());

type TProjectsGrouped = {
    user: {
        name: string,
        email: string,
        given_name: string,
        picture: string,
        created_at: Date
    },
    projects: {
        premium: boolean,
        created_at: Date,
        project_name: string,
        total_visits: number,
        total_events: number,
    }[]
}

const projectsGrouped = computed(() => {

    if (!projects.value) return [];

    const result: TProjectsGrouped[] = [];

    for (const project of projects.value) {

        if (!project.user) continue;


        const target = result.find(e => e.user.email == project.user.email);

        if (target) {

            target.projects.push({
                created_at: project.created_at,
                premium: project.premium,
                project_name: project.project_name,
                total_events: project.total_events,
                total_visits: project.total_visits
            });

        } else {

            const item: TProjectsGrouped = {
                user: project.user,
                projects: [{
                    created_at: project.created_at,
                    premium: project.premium,
                    project_name: project.project_name,
                    total_events: project.total_events,
                    total_visits: project.total_visits
                }]
            }

            result.push(item);

        }

    }

    return result;

});

function onHideClicked() {
    isAdminHidden.value = true;
}

const activeProject = useActiveProject();

</script>


<template>
    <div class="bg-bg overflow-y-auto w-full h-dvh p-6 gap-6 flex flex-col">


        <div @click="onHideClicked()" v-if="!isAdminHidden"
            class="bg-menu hover:bg-menu/70 cursor-pointer flex gap-2 rounded-lg w-fit px-6 py-4 text-text-sub">
            <div class="text-text-sub/90"> <i class="far fa-eye"></i> </div>
            <div> Nascondi dalla barra </div>
        </div>


        <div v-for="item of projectsGrouped" class="bg-menu p-4 rounded-xl flex flex-col gap-2 w-full relative">
            <div class="flex flex-col gap-6">

                <div class="flex flex-col gap-1">
                    <div> {{ item.user.email }} </div>
                    <div> {{ item.user.name }} </div>
                </div>

                <div class="flex justify-evenly flex-col lg:flex-row gap-2 lg:gap-0">
                    <div v-for="project of item.projects"
                        class="lg:w-[30%] flex flex-col items-center bg-bg p-6 rounded-xl">
                        <div class="flex gap-4">
                            <div class="font-bold"> {{ project.premium ? 'PREMIUM' : 'FREE' }} </div>
                            <div class="text-text-sub/90">
                                {{ new Date(project.created_at).toLocaleDateString('it-IT') }}
                            </div>
                        </div>


                        <div class="text-ellipsis line-clamp-1"> {{ project.project_name }} </div>
                        <div class="flex gap-2">
                            <div> Visits: </div>
                            <div> {{ project.total_visits }} </div>
                            <div> Events: </div>
                            <div> {{ project.total_events }} </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<style scoped></style>