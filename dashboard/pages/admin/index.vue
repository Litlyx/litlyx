<script setup lang="ts">

import type { AdminProjectsList } from '~/server/api/admin/projects';

definePageMeta({ layout: 'dashboard' });



const timeRange = ref<number>(9);

function setTimeRange(n: number) {
    timeRange.value = n;
}

const timeRangeTimestamp = computed(()=>{
    if (timeRange.value == 1) return Date.now() - 1000 * 60 * 60 * 24;
    if (timeRange.value == 2) return Date.now() - 1000 * 60 * 60 * 24 * 7;
    if (timeRange.value == 3) return Date.now() - 1000 * 60 * 60 * 24 * 30;
    return 0;
})


const { data: projectsAggregatedResponseData } = await useFetch<AdminProjectsList[]>('/api/admin/projects', signHeaders());
const { data: counts } = await useFetch(()=> `/api/admin/counts?from=${timeRangeTimestamp.value}`, signHeaders());



function onHideClicked() {
    isAdminHidden.value = true;
}


const projectsAggregated = computed(() => {
    return projectsAggregatedResponseData.value?.sort((a, b) => {
        const sumVisitsA = a.projects.reduce((pa, pe) => pa + (pe.counts?.visits || 0) + (pe.counts?.events || 0), 0);
        const sumVisitsB = b.projects.reduce((pa, pe) => pa + (pe.counts?.visits || 0) + (pe.counts?.events || 0), 0);
        return sumVisitsB - sumVisitsA;
    }).filter(e=>{
        return new Date(e.created_at).getTime() >= timeRangeTimestamp.value
    });
})

const premiumCount = computed(() => {
    let premiums = 0;
    projectsAggregated.value?.forEach(e => {
        e.projects.forEach(p => {
            if (p.premium) premiums++;
        });

    })
    return premiums;
})


const activeProjects = computed(() => {
    let actives = 0;

    projectsAggregated.value?.forEach(e => {
        e.projects.forEach(p => {
            if (!p.counts) return;
            if (!p.counts.updated_at) return;
            const updated_at = new Date(p.counts.updated_at).getTime();
            if (updated_at < Date.now() - 1000 * 60 * 60 * 24) return;
            actives++;
        });
    })
    return actives;
});



const totalVisits = computed(() => {
    return projectsAggregated.value?.reduce((a, e) => {
        return a + e.projects.reduce((pa, pe) => pa + (pe.counts?.visits || 0), 0);
    }, 0) || 0;
});

const totalEvents = computed(() => {
    return projectsAggregated.value?.reduce((a, e) => {
        return a + e.projects.reduce((pa, pe) => pa + (pe.counts?.events || 0), 0);
    }, 0) || 0;
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


function dateDiffDays(a: string) {
    return (Date.now() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)
}

function getLogBg(last_logged_at?: string) {

    const day = 1000 * 60 * 60 * 24;
    const week = 1000 * 60 * 60 * 24 * 7;

    const lastLoggedAtDate = new Date(last_logged_at || 0);

    if (lastLoggedAtDate.getTime() > Date.now() - day) {
        return 'bg-green-500'
    } else if (lastLoggedAtDate.getTime() > Date.now() - week) {
        return 'bg-yellow-500'
    } else {
        return 'bg-red-500'
    }

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



        <Card class="p-2 flex gap-10 items-center justify-center">
            <div :class="{ 'text-red-200': timeRange == 1 }" @click="setTimeRange(1)"> Last day </div>
            <div :class="{ 'text-red-200': timeRange == 2 }" @click="setTimeRange(2)"> Last week </div>
            <div :class="{ 'text-red-200': timeRange == 3 }" @click="setTimeRange(3)"> Last month </div>
            <div :class="{ 'text-red-200': timeRange == 9 }" @click="setTimeRange(9)"> All </div>
        </Card>

        <Card class="p-4">

            <div class="grid grid-cols-2 gap-1">
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
                    Active: {{ activeProjects }} |
                    Dead: {{ (counts?.projects || 0) - activeProjects }}
                </div>
                <div>
                    Total events: {{ formatNumberK(totalEvents) }}
                </div>
            </div>

        </Card>


        <div v-for="item of projectsAggregated || []"
            class="bg-menu p-4 rounded-xl flex flex-col gap-2 w-full relative">
            <div class="flex flex-col gap-6">

                <div class="flex flex-col gap-1">
                    <div> {{ item.email }} </div>
                    <div> {{ item.name }} </div>
                </div>

                <div class="flex justify-evenly flex-col lg:grid lg:grid-cols-3 gap-2 lg:gap-4">

                    <div v-for="project of item.projects"
                        class="flex relative flex-col items-center bg-bg p-6 rounded-xl">

                        <div class="absolute left-2 top-2 flex items-center gap-2">
                            <div :class="getLogBg(project?.counts?.updated_at)" class="h-3 w-3 rounded-full"> </div>
                            <div> {{ dateDiffDays(project?.counts?.updated_at || '0').toFixed(0) }} days </div>
                        </div>

                        <div class="flex gap-4">
                            <div class="font-bold"> {{ project.premium ? 'PREMIUM' : 'FREE' }} </div>
                            <div class="text-text-sub/90">
                                {{ new Date(project.created_at).toLocaleDateString('it-IT') }}
                            </div>
                        </div>


                        <div class="text-ellipsis line-clamp-1"> {{ project.name }} </div>
                        <div class="flex gap-2">
                            <div> Visits: </div>
                            <div> {{ formatNumberK(project.counts?.visits || 0) }} </div>
                            <div> Events: </div>
                            <div> {{ formatNumberK(project.counts?.events || 0) }} </div>
                            <div> Sessions: </div>
                            <div> {{ formatNumberK(project.counts?.sessions || 0) }} </div>
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