<script setup lang="ts">

import type { AdminProjectsList } from '~/server/api/admin/projects';

definePageMeta({ layout: 'dashboard' });

const { data: projects } = await useFetch<AdminProjectsList[]>('/api/admin/projects', signHeaders());
const { data: counts } = await useFetch('/api/admin/counts', signHeaders());


type TProjectsGrouped = {
    user: {
        name: string,
        email: string,
        given_name: string,
        picture: string,
        created_at: Date
    },
    projects: {
        _id: string,
        premium: boolean,
        premium_type: number,
        created_at: Date,
        project_name: string,
        total_visits: number,
        total_events: number,
        total_sessions: number
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
                _id: project._id,
                created_at: project.created_at,
                premium_type: project.premium_type,
                premium: project.premium,
                project_name: project.project_name,
                total_events: project.total_events,
                total_visits: project.total_visits,
                total_sessions: project.total_sessions
            });

        } else {

            const item: TProjectsGrouped = {
                user: project.user,
                projects: [{
                    _id: project._id,
                    created_at: project.created_at,
                    premium: project.premium,
                    premium_type: project.premium_type,
                    project_name: project.project_name,
                    total_events: project.total_events,
                    total_visits: project.total_visits,
                    total_sessions: project.total_sessions
                }]
            }

            result.push(item);

        }

    }

    result.sort((sa, sb) => {
        const ca = sa.projects.reduce((a, e) => a + (e.total_visits + e.total_events), 0);
        const cb = sb.projects.reduce((a, e) => a + (e.total_visits + e.total_events), 0);
        return cb - ca;
    })

    return result;

});

function onHideClicked() {
    isAdminHidden.value = true;
}

const premiumCount = computed(() => {
    let premiums = 0;
    projects.value?.forEach(e => {
        if (e.premium) premiums++;
    })
    return premiums;
})



const totalVisits = computed(() => {
    return projects.value?.reduce((a, e) => a + e.total_visits, 0) || 0;
});
const totalEvents = computed(() => {
    return projects.value?.reduce((a, e) => a + e.total_events, 0) || 0;
});

const details = ref<any>();
const showDetails = ref<boolean>(false);
async function getProjectDetails(project_id: string) {
    details.value = await $fetch(`/api/admin/details?project_id=${project_id}`, signHeaders());
    showDetails.value = true;
}

async function resetCount(project_id: string) {
    await $fetch(`/api/admin/reset_count?project_id=${project_id}`, signHeaders());
}

</script>


<template>
    <div class="bg-bg overflow-y-auto w-full h-dvh p-6 gap-6 flex flex-col">

        <div v-if="showDetails"
            class="w-full md:px-40 h-full fixed top-0 left-0 bg-black/90 backdrop-blur-[2px] z-[20] overflow-y-auto">
            <div class="cursor-pointer bg-red-400 w-fit px-10 py-2 rounded-lg font-semibold my-3"
                @click="showDetails = false">
                Close
            </div>
            <div class="whitespace-pre-wrap poppins">
                {{ JSON.stringify(details, null, 3) }}
            </div>
        </div>

        <div @click="onHideClicked()" v-if="!isAdminHidden"
            class="bg-menu hover:bg-menu/70 cursor-pointer flex gap-2 rounded-lg w-fit px-6 py-4 text-text-sub">
            <div class="text-text-sub/90"> <i class="far fa-eye"></i> </div>
            <div> Hide from the bar </div>
        </div>


        <Card class="p-4">

            <div class="grid grid-cols-2">
                <div>
                    Users: {{ counts?.users }}
                </div>
                <div>
                    Projects: {{ counts?.projects }} ( {{ premiumCount }} premium )
                </div>
                <div>
                    Total visits: {{ formatNumberK(totalVisits) }}
                </div>
                <div>
                    Total events: {{ formatNumberK(totalEvents) }}
                </div>
            </div>

        </Card>


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
                            <div> Sessions: </div>
                            <div> {{ project.total_sessions }} </div>
                        </div>

                        <div class="flex gap-4 items-center mt-4">
                            <LyxUiButton type="secondary" @click="getProjectDetails(project._id)">
                                Payment details
                            </LyxUiButton>
                            <LyxUiButton type="danger" @click="resetCount(project._id)">
                                Refresh counts
                            </LyxUiButton>
                        </div>

                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<style scoped></style>