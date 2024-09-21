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
    watch(activeProject, async () => {
        limitsInfo.value = await $fetch<any>("/api/project/limits_info", signHeaders());
    });
});


const firstInteractionUrl = computed(() => {
    return `/api/metrics/${activeProject.value?._id}/first_interaction`
});

const firstInteraction = useFetch<boolean>(firstInteractionUrl, {
    ...signHeaders(),
    lazy: true
});

const selectLabels = [
    { label: 'Hour', value: 'hour' },
    { label: 'Day', value: 'day' },
    // { label: 'Month', value: 'month' },
];



const { snapshot } = useSnapshot();

const refreshKey = computed(() => `${snapshot.value._id.toString() + activeProject.value?._id.toString()}`);

const isPremium = computed(() => {
    return activeProject.value?.premium;
})

const pricingDrawer = usePricingDrawer();

function goToUpgrade() {
    pricingDrawer.visible.value = true;
}


</script>

<template>

    <div class="dashboard w-full h-full overflow-y-auto pb-20 md:pt-4 lg:pt-0">

        <div :key="'home-' + isLiveDemo()" v-if="projects && activeProject && (firstInteraction.data.value === true)">

            <div class="w-full px-4 py-2 gap-2 flex flex-col">
                <div v-if="limitsInfo && limitsInfo.limited"
                    class="w-full bg-[#fbbf2422] p-4 rounded-lg text-[.9rem] flex items-center">
                    <div class="flex flex-col grow">
                        <div class="poppins font-semibold text-[#fbbf24]">
                            Limit reached
                        </div>
                        <div class="poppins text-[#fbbf24]">
                            Litlyx cannot receive new data as you reached your plan's limit. Resume all the great
                            features and collect even more data with a higher plan.
                        </div>
                    </div>
                    <div>
                        <LyxUiButton type="outline" @click="goToUpgrade()"> Upgrade </LyxUiButton>
                    </div>
                </div>
                <div v-if="!isPremium" class="w-full bg-[#5680f822] p-4 rounded-lg text-[.9rem] flex items-center">
                    <div class="flex flex-col grow">
                        <div class="poppins font-semibold text-lyx-primary">
                            Launch offer: 25% off
                        </div>
                        <div class="poppins text-lyx-primary">
                            We're offering an exclusive 25% discount forever on all plans starting from the Acceleration
                            Plan for our first 100 users who believe in our project.
                            <br>
                            Redeem Code: <span class="text-white font-bold text-[1rem]">LIT25</span> at checkout to
                            claim your discount.
                        </div>
                    </div>
                    <div>
                        <LyxUiButton type="outline" @click="goToUpgrade()"> Upgrade </LyxUiButton>
                    </div>
                </div>
            </div>

            <DashboardTopSection></DashboardTopSection>
            <DashboardTopCards :key="refreshKey"></DashboardTopCards>



            <div class="mt-6 px-6 flex gap-6 flex-col 2xl:flex-row w-full">
                <DashboardActionableChart :key="refreshKey"></DashboardActionableChart>
            </div>
            <!-- 
            <div class="mt-6 px-6 flex gap-6 flex-col 2xl:flex-row">

                <CardTitled :key="refreshKey" class="p-4 flex-1 w-full" title="Visits trends"
                    sub="Shows trends in page visits.">
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

<CardTitled :key="refreshKey" class="p-4 flex-1 w-full" title="Sessions" sub="Shows trends in sessions.">
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

</div> -->

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <DashboardWebsitesBarCard :key="refreshKey"></DashboardWebsitesBarCard>
                    </div>
                    <div class="flex-1">
                        <DashboardEventsBarCard :key="refreshKey"></DashboardEventsBarCard>
                    </div>
                </div>
            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <DashboardReferrersBarCard :key="refreshKey"></DashboardReferrersBarCard>
                    </div>
                    <div class="flex-1">
                        <DashboardBrowsersBarCard :key="refreshKey"></DashboardBrowsersBarCard>
                    </div>
                </div>
            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <DashboardOssBarCard :key="refreshKey"></DashboardOssBarCard>
                    </div>
                    <div class="flex-1">
                        <DashboardGeolocationBarCard :key="refreshKey"></DashboardGeolocationBarCard>
                    </div>
                </div>
            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <DashboardDevicesBarCard :key="refreshKey"></DashboardDevicesBarCard>
                    </div>
                    <div class="flex-1">
                    </div>
                </div>
            </div>

        </div>


        <FirstInteraction :refresh-interaction="firstInteraction.refresh" :first-interaction="(firstInteraction.data.value || false)"></FirstInteraction>

        <div class="text-text/85 mt-8 ml-8 poppis text-[1.2rem]" v-if="projects && projects.length == 0">
            Create your first project...
        </div>

    </div>

</template>

<style scoped lang="scss"></style>
