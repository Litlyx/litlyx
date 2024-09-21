<script setup lang="ts">

definePageMeta({ layout: 'none' });

const { snapshot, snapshots } = useSnapshot();

const { data: project } = useLiveDemo();

const ready = ref<boolean>(false);

let interval: any;

onMounted(async () => {
    await getOnlineUsers();
    snapshot.value = snapshots.value[0];
    interval = setInterval(async () => {
        await getOnlineUsers();
    }, 20000);

    setTimeout(() => {
        ready.value = true;
    }, 2000);
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
        <div v-if="project && ready">

            <div
                class="bg-bg w-full px-6 py-6 text-text/90 flex flex-collg:flex-row text-lg lg:text-2xl gap-2 lg:gap-12">

                <div class="flex items-center w-full flex-col md:flex-row">
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
                    <div class="flex gap-2 md:pt-0 pt-4">
                        <LyxUiButton link="/" type="primary"
                            class="poppins font-semibold text-[.9rem] lg:text-[1.2rem] flex items-center !px-14 py-4">
                            Get started for free
                        </LyxUiButton>
                    </div>
                </div>
            </div>


            <div>
                <DashboardTopCards></DashboardTopCards>
            </div>

            <div class="mt-6 px-6 flex gap-6 flex-col 2xl:flex-row w-full">
                <DashboardActionableChart></DashboardActionableChart>
            </div>

            <div class="flex gap-6 flex-col xl:flex-row p-6">

                <CardTitled class="p-4 flex-[4] w-full h-full" title="Events" sub="Events stacked bar chart.">
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

                <CardTitled title="Top events" sub=" Displays key events." class="p-4 flex-[2] w-full h-full">
                    <div>
                        <DashboardEventsChart class="w-full"> </DashboardEventsChart>
                    </div>
                </CardTitled>
            </div>


            <div class="flex w-full justify-center px-6">
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
                <div class="flex flex-col lg:flex-row justify-between w-full items-center gap-10 lg:gap-0 lg:px-10">

                    <div class="text-[1.9rem] lg:text-[2.2rem] text-center lg:text-left px-2 lg:px-0">
                        <div class="poppins font-semibold text-accent">
                            Do you want this KPIs for your website ?
                        </div>
                        <div class="poppins font-semibold text-text-sub">
                            Start now! It's free.
                        </div>
                    </div>

                    <div class="flex gap-2 flex-col md:flex-row">
                        <LyxUiButton link="/" type="primary"
                            class="poppins font-semibold text-[1.1rem] lg:text-[1.6rem] flex items-center !px-14">
                            Get started
                        </LyxUiButton>
                        <NuxtLink target="_blank" to="https://cal.com/litlyx/30min"
                            class="bg-white hover:bg-white/90 text-black px-14 py-4 poppins font-semibold text-[1.1rem] lg:text-[1.6rem] rounded-lg">
                            Book a demo
                        </NuxtLink>
                    </div>

                </div>
            </div>


        </div>
        <div v-if="!ready || !project" class="flex justify-center py-40">
            <i class="fas fa-spinner text-[2rem] text-accent animate-[spin_1s_linear_infinite] duration-500"></i>
        </div>
    </div>

</template>

<style scoped lang="scss"></style>
