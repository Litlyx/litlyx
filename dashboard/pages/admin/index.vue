<script setup lang="ts">

import type { CItem } from '~/components/CustomTab.vue';

definePageMeta({ layout: 'dashboard' });


const filterPremium = ref<boolean>(false);
const filterAppsumo = ref<boolean>(false);



const timeRange = ref<number>(9);

function setTimeRange(n: number) {
    timeRange.value = n;
}

const timeRangeTimestamp = computed(() => {
    if (timeRange.value == 1) return Date.now() - 1000 * 60 * 60 * 24;
    if (timeRange.value == 2) return Date.now() - 1000 * 60 * 60 * 24 * 7;
    if (timeRange.value == 3) return Date.now() - 1000 * 60 * 60 * 24 * 30;
    return 0;
})


// const { data: projectsAggregatedResponseData } = await useFetch<AdminProjectsList[]>('/api/admin/projects', signHeaders());
// const { data: counts } = await useFetch(() => `/api/admin/counts?from=${timeRangeTimestamp.value}`, signHeaders());



// function onHideClicked() {
//     isAdminHidden.value = true;
// }


// function isAppsumoType(type: number) {
//     return type > 6000 && type < 6004
// }

// const projectsAggregated = computed(() => {

//     let pool = projectsAggregatedResponseData.value ? [...projectsAggregatedResponseData.value] : [];

//     let shownPool: AdminProjectsList[] = [];


//     for (const element of pool) {

//         shownPool.push({ ...element, projects: [...element.projects] });

//         if (filterAppsumo.value === true) {
//             shownPool.forEach(e => {
//                 e.projects = e.projects.filter(project => {
//                     return isAppsumoType(project.premium_type)
//                 })
//             })

//             shownPool = shownPool.filter(e => {
//                 return e.projects.length > 0;
//             })

//         } else if (filterPremium.value === true) {
//             shownPool.forEach(e => {
//                 e.projects = e.projects.filter(project => {
//                     return project.premium === true;
//                 })
//             })

//             shownPool = shownPool.filter(e => {
//                 return e.projects.length > 0;
//             })

//         } else {
//             console.log('NO DATA')
//         }
//     }




//     return shownPool.sort((a, b) => {
//         const sumVisitsA = a.projects.reduce((pa, pe) => pa + (pe.counts?.visits || 0) + (pe.counts?.events || 0), 0);
//         const sumVisitsB = b.projects.reduce((pa, pe) => pa + (pe.counts?.visits || 0) + (pe.counts?.events || 0), 0);
//         return sumVisitsB - sumVisitsA;
//     }).filter(e => {
//         return new Date(e.created_at).getTime() >= timeRangeTimestamp.value
//     });
// })

// const premiumCount = computed(() => {
//     let premiums = 0;
//     projectsAggregated.value?.forEach(e => {
//         e.projects.forEach(p => {
//             if (p.premium) premiums++;
//         });

//     })
//     return premiums;
// })


// const activeProjects = computed(() => {
//     let actives = 0;

//     projectsAggregated.value?.forEach(e => {
//         e.projects.forEach(p => {
//             if (!p.counts) return;
//             if (!p.counts.updated_at) return;
//             const updated_at = new Date(p.counts.updated_at).getTime();
//             if (updated_at < Date.now() - 1000 * 60 * 60 * 24) return;
//             actives++;
//         });
//     })
//     return actives;
// });



// const totalVisits = computed(() => {
//     return projectsAggregated.value?.reduce((a, e) => {
//         return a + e.projects.reduce((pa, pe) => pa + (pe.counts?.visits || 0), 0);
//     }, 0) || 0;
// });

// const totalEvents = computed(() => {
//     return projectsAggregated.value?.reduce((a, e) => {
//         return a + e.projects.reduce((pa, pe) => pa + (pe.counts?.events || 0), 0);
//     }, 0) || 0;
// });



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


const tabs: CItem[] = [
    { label: 'Overview', slot: 'overview' },
    { label: 'Users', slot: 'users' },
    { label: 'Feedbacks', slot: 'feedbacks' },
    { label: 'OnBoarding', slot: 'onboarding' },
    { label: 'Backend', slot: 'backend' }
]

</script>


<template>
    <div class="bg-bg overflow-y-hidden w-full p-6 gap-6 flex flex-col h-full">

        <CustomTab :items="tabs" :manualScroll="true">
            <template #overview>
                <AdminOverview></AdminOverview>
            </template>
            <template #users>
                <AdminUsers></AdminUsers>
            </template>
            <template #feedbacks>
                <AdminFeedbacks></AdminFeedbacks>
            </template>
            <template #onboarding>
                <AdminOnboardings></AdminOnboardings>
            </template>
            <template #backend>
                <AdminBackend></AdminBackend>
            </template>
        </CustomTab>

    </div>
</template>

<style scoped></style>