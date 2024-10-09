<script setup lang="ts">

definePageMeta({ layout: 'dashboard' });


const route = useRoute();
const { project, projectList, projectId } = useProject();

const justLogged = computed(() => route.query.just_logged);

onMounted(() => {
    if (justLogged.value) {
        setTimeout(() => {
            location.href = '/'
        }, 500)
    }
})

const firstInteraction = useFetch<boolean>('/api/project/first_interaction', {
    lazy: true, headers: useComputedHeaders({ useSnapshotDates: false })
});

const showDashboard = computed(() => project.value && firstInteraction.data.value);

</script>

<template>

    <div class="dashboard w-full h-full overflow-y-auto pb-20 md:pt-4 lg:pt-0">

        <div v-if="showDashboard">

            <div class="w-full px-4 py-2 gap-2 flex flex-col">
                <BannerLimitsInfo :key="refreshKey"></BannerLimitsInfo>
                <BannerOffer :key="refreshKey"></BannerOffer>
            </div>

            <div>
                <DashboardTopSection :key="refreshKey"></DashboardTopSection>
                <DashboardTopCards :key="refreshKey"></DashboardTopCards>
            </div>

            <div class="mt-6 px-6 flex gap-6 flex-col 2xl:flex-row w-full">
                <DashboardActionableChart :key="refreshKey"></DashboardActionableChart>
            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <BarCardWebsites :key="refreshKey"></BarCardWebsites>
                    </div>
                    <div class="flex-1">
                        <BarCardReferrers :key="refreshKey"></BarCardReferrers>
                    </div>
                </div>
            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <BarCardBrowsers :key="refreshKey"></BarCardBrowsers>
                    </div>
                    <div class="flex-1">
                        <BarCardOperatingSystems :key="refreshKey"></BarCardOperatingSystems>
                    </div>
                </div>
            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <BarCardGeolocations :key="refreshKey"></BarCardGeolocations>
                    </div>
                    <div class="flex-1">
                        <BarCardDevices :key="refreshKey"></BarCardDevices>
                    </div>
                </div>
            </div>

        </div>


        <FirstInteraction v-if="!justLogged" :refresh-interaction="firstInteraction.refresh"
            :first-interaction="(firstInteraction.data.value || false)"></FirstInteraction>

        <div class="text-text/85 mt-8 ml-8 poppis text-[1.2rem]"
            v-if="projectList && projectList.length == 0 && !justLogged">
            Create your first project...
        </div>

        <div v-if="justLogged" class="text-[2rem]">
            The page will refresh soon
        </div>

    </div>

</template>

<style scoped lang="scss"></style>
