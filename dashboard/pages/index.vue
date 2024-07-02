<script setup lang="ts">

definePageMeta({ layout: 'dashboard' });

const { data: projects } = useProjectsList();
const activeProject = useActiveProject();

const mainChartSelectIndex = ref<number>(1);
const sessionsChartSelectIndex = ref<number>(1);


const route = useRoute();


const limitsInfo = ref<{
    limited: boolean,
    maxLimit: number,
    limit: number,
    total: number,
    percent: number
}>();


onMounted(async () => {
    if (route.query.just_logged) return location.href = '/';
    limitsInfo.value = await $fetch<any>("/api/project/limits_info", signHeaders());
});


function copyProjectId() {
    if (!navigator.clipboard) alert('NON PUOI COPIARE IN HTTP');
    navigator.clipboard.writeText(activeProject.value?._id?.toString() || '');
    alert('Copiato !');
}


function copyScript() {
    if (!navigator.clipboard) alert('NON PUOI COPIARE IN HTTP');


    const createScriptText = () => {
        return [
            '<script defer ',
            `data-project="${activeProject.value?._id}" `,
            'src="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js"></',
            'script>'
        ].join('')
    }

    navigator.clipboard.writeText(createScriptText());
    alert('Copiato !');
}

const { data: firstInteraction, pending, refresh } = useFirstInteractionData();


watch(pending, () => {
    if (pending.value === true) return;
    if (firstInteraction.value === false) {
        setTimeout(() => { refresh(); }, 2000);
    }
})

const selectLabels = [
    { label: 'Hour', value: 'hour' },
    { label: 'Day', value: 'day' },
    // { label: 'Month', value: 'month' },
];


</script>


<template>

    <div class="dashboard w-full h-full overflow-y-auto pb-20 md:pt-4 lg:pt-0">

        <div :key="'home-' + isLiveDemo()" v-if="projects && activeProject && firstInteraction">

            <div class="w-full px-4 py-2">
                <div v-if="limitsInfo && limitsInfo.limited"
                    class="bg-orange-600 justify-center flex gap-2 py-2 px-4 font-semibold text-[1.2rem] rounded-lg">
                    <div class="poppins text-text"> Limit reached </div>
                    <NuxtLink to="/plans" class="poppins text-[#393972] underline cursor-pointer">
                        Upgrade project
                    </NuxtLink>
                </div>
            </div>

            <DashboardTopSection></DashboardTopSection>
            <DashboardTopCards></DashboardTopCards>


            <div class="mt-6 px-6 flex gap-6 flex-col 2xl:flex-row">

                <CardTitled class="p-4 flex-1" title="Visits trends" sub="Shows trends in page visits.">
                    <template #header>
                        <SelectButton @changeIndex="mainChartSelectIndex = $event" :currentIndex="mainChartSelectIndex"
                            :options="selectLabels">
                        </SelectButton>
                    </template>
                    <div>
                        <DashboardVisitsLineChart :slice="(selectLabels[mainChartSelectIndex].value as any)">
                        </DashboardVisitsLineChart>
                    </div>
                </CardTitled>

                <CardTitled class="p-4 flex-1" title="Sessions" sub="Shows trends in sessions.">
                    <template #header>
                        <SelectButton @changeIndex="sessionsChartSelectIndex = $event"
                            :currentIndex="sessionsChartSelectIndex" :options="selectLabels">
                        </SelectButton>
                    </template>
                    <div>
                        <DashboardSessionsLineChart :slice="(selectLabels[sessionsChartSelectIndex].value as any)">
                        </DashboardSessionsLineChart>
                    </div>
                </CardTitled>

            </div>


            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <DashboardWebsitesBarCard></DashboardWebsitesBarCard>
                    </div>
                    <div class="flex-1">
                        <DashboardEventsBarCard></DashboardEventsBarCard>
                    </div>
                </div>
            </div>

      
            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <DashboardReferrersBarCard></DashboardReferrersBarCard>
                    </div>
                    <div class="flex-1">
                        <DashboardBrowsersBarCard></DashboardBrowsersBarCard>
                    </div>
                </div>
            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <DashboardOssBarCard></DashboardOssBarCard>
                    </div>
                    <div class="flex-1">
                        <DashboardGeolocationBarCard></DashboardGeolocationBarCard>
                    </div>
                </div>
            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <DashboardDevicesBarCard></DashboardDevicesBarCard>
                    </div>
                    <div class="flex-1">
                    </div>
                </div>
            </div> 

        </div>

        <div v-if="!firstInteraction && activeProject" class="mt-[36vh] flex flex-col gap-6">
            <div class="flex gap-4 items-center justify-center">
                <div class="animate-pulse w-[1.5rem] h-[1.5rem] bg-accent rounded-full"> </div>
                <div class="text-text/90 poppins text-[1.4rem] font-bold">
                    Waiting for your first Visit or Event
                </div>
            </div>

            <div class="flex justify-center gap-10 flex-col lg:flex-row items-center lg:items-stretch px-10">

                <div class="bg-menu p-6 rounded-xl flex flex-col gap-2 w-full">
                    <div class="poppins font-semibold"> Copy your project_id: </div>
                    <div class="flex items-center gap-2">
                        <div> <i @click="copyProjectId()" class="cursor-pointer hover:text-text far fa-copy"></i> </div>
                        <div class="text-[.9rem] text-[#acacac]"> {{ activeProject?._id }} </div>
                    </div>
                </div>

                <div class="bg-menu p-6 rounded-xl flex flex-col gap-2 w-full lg:max-w-[40vw]">
                    <div class="poppins font-semibold">
                        Start logging visits in 1 click | Plug anywhere !
                    </div>
                    <div class="flex items-center gap-4">
                        <div> <i @click="copyScript()" class="cursor-pointer hover:text-text far fa-copy"></i> </div>
                        <div class="text-[.9rem] text-[#acacac] lg:w-min">
                            {{ `
                            <script defer data-project="${activeProject?._id}"
                                src="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js"></script>` }}
                        </div>
                    </div>
                </div>

            </div>

            <div></div>
        </div>


        <div class="text-text/85 mt-8 ml-8 poppis text-[1.2rem]" v-if="projects && projects.length == 0">
            Create your first project...
        </div>

    </div>

</template>

<style scoped lang="scss"></style>
