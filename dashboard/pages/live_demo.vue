<script setup lang="ts">

definePageMeta({ layout: 'none' });


const { data: project } = useLiveDemo();

let interval: any;

onMounted(async () => {
    await getOnlineUsers();

    interval = setInterval(async () => {
        await getOnlineUsers();
    }, 5000);

})

onUnmounted(() => {
    try {
        if (interval) clearInterval(interval);
    } catch (ex) {

    }
})

async function getOnlineUsers() {
    if (!project.value) return;
    const online = await $fetch<number>(`/api/metrics/${project.value._id}/live_users`, signHeaders());
    onlineUsers.value = online;
}

const onlineUsers = ref<number | undefined>();

const mainChartSelectIndex = ref<number>(1);
const sessionsChartSelectIndex = ref<number>(1);
const eventsStackedSelectIndex = ref<number>(0);

const selectLabels = [
    { label: 'Hour', value: 'hour' },
    { label: 'Day', value: 'day' }
];

const selectLabelsEvents = [
    { label: 'Day', value: 'day' },
    { label: 'Month', value: 'month' },
];


</script>


<template>

    <div class="dashboard w-full h-full overflow-y-auto pb-20">

        <div v-if="project">

            <div
                class="bg-bg w-full px-6 py-6 text-text/90 flex flex-collg:flex-row text-lg lg:text-2xl gap-2 lg:gap-12">

                <div class="flex items-center w-full">
                    <div class="flex flex-col gap-2">
                        <div class="poppins font-semibold">
                            Litlyx open metrics
                        </div>
                        <div v-if="project" class="flex gap-2 items-center text-text/90">
                            <div class="animate-pulse w-[1rem] h-[1rem] bg-green-400 rounded-full"> </div>
                            <div> {{ onlineUsers }} Online users</div>
                        </div>
                    </div>
                    <div class="grow"></div>
                    <div class="flex gap-2">
                        <NuxtLink target="_blank" to="https://cal.com/litlyx/30min"
                            class="bg-white hover:bg-white/90 px-4 py-3 text-black poppins font-semibold text-[.9rem] lg:text-[1.2rem] rounded-lg">
                            Book a demo
                        </NuxtLink>
                        <NuxtLink to="/"
                            class="bg-accent hover:bg-accent/90 px-4 py-3 poppins font-semibold text-[.9rem] lg:text-[1.2rem] rounded-lg">
                            Go to dashboard
                        </NuxtLink>
                    </div>
                </div>
            </div>


            <div>
                <DashboardTopCards></DashboardTopCards>
            </div>

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

            <div class="p-6">
                
                <CardTitled class="p-4 flex-1" title="Events" sub="Events stacked bar chart.">
                    <template #header>
                        <SelectButton @changeIndex="eventsStackedSelectIndex = $event"
                            :currentIndex="eventsStackedSelectIndex" :options="selectLabelsEvents">
                        </SelectButton>
                    </template>
                    <div>
                        <EventsStackedBarChart :slice="(selectLabelsEvents[eventsStackedSelectIndex].value as any)">
                        </EventsStackedBarChart>
                    </div>
                </CardTitled>
            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col lg:flex-row">
                    <div class="flex-1">
                        <DashboardWebsitesBarCard></DashboardWebsitesBarCard>
                    </div>
                    <div class="flex-1">
                        <DashboardEventsBarCard></DashboardEventsBarCard>
                    </div>
                </div>
            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col lg:flex-row">
                    <div class="flex-1">
                        <DashboardReferrersBarCard></DashboardReferrersBarCard>
                    </div>
                    <div class="flex-1">
                        <DashboardBrowsersBarCard></DashboardBrowsersBarCard>
                    </div>
                </div>
            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col lg:flex-row">
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
                        <!-- <DashboardGeolocationBarCard></DashboardGeolocationBarCard> -->
                    </div>
                </div>
            </div>


            <div class="justify-center mt-14 lg:mt-40 flex flex-col items-center gap-14 lg:gap-20">
                <div class="poppins text-[1.3rem]">
                    Made with ❤ in Italy
                </div>
                <div class="flex flex-col lg:flex-row justify-between w-full items-center gap-10 lg:gap-0">

                    <div class="text-[1.9rem] lg:text-[2.2rem] text-center lg:text-left px-2 lg:px-0">
                        <div class="poppins font-semibold text-accent">
                            Do you want this KPIs for your website ?
                        </div>
                        <div class="poppins font-semibold text-text-sub">
                            Start now ! It's free.
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <NuxtLink to="/"
                            class="bg-accent hover:bg-accent/90 px-14 py-4 poppins font-semibold text-[1.1rem] lg:text-[1.6rem] rounded-lg">
                            Get started
                        </NuxtLink>
                        <NuxtLink target="_blank" to="https://cal.com/litlyx/30min"
                            class="bg-white hover:bg-white/90 text-black px-14 py-4 poppins font-semibold text-[1.1rem] lg:text-[1.6rem] rounded-lg">
                            Book a demo
                        </NuxtLink>
                    </div>

                </div>
            </div>


        </div>
    </div>

</template>

<style scoped lang="scss"></style>
