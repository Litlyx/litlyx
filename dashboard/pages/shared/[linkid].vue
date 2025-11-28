<script lang="ts" setup>
import LineDataNew from '~/components/complex/LineDataNew.vue';
import { CalendarIcon, MoonIcon, SunIcon, Flame } from 'lucide-vue-next'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import ActionableChart from '~/components/complex/ActionableChart.vue';
import { toast } from 'vue-sonner';

const route = useRoute();
const sharedLinkId = route.params.linkid;
const { sharedLink, timeValue, sharedPassword, needPassword } = useShared();
const df = new DateFormatter('en-US', { dateStyle: 'medium' })
const popoverOpen = ref<boolean>(false);


const { data: live_users, status: live_users_status, refresh: live_users_refresh } = useAuthFetch(`/api/share/live_users?linkId=${sharedLinkId}`);

let interval: any;

onMounted(async () => {
    const info = await useAuthFetchSync(`/api/share/info?linkId=${sharedLinkId}`);
    needPassword.value = info.hasPassword;
    sharedLink.value = sharedLinkId.toString();
    interval = setInterval(() => {
        live_users_refresh();
    }, 10000);
});

onUnmounted(() => {
    if (interval) clearInterval(interval)
})


function setDays(days: number) {
    const start = new Date(Date.now() - 1000 * 60 * 60 * 24 * days);
    const end = new Date();
    timeValue.value.start = new CalendarDate(start.getUTCFullYear(), start.getUTCMonth() + 1, start.getUTCDate());
    timeValue.value.end = new CalendarDate(end.getUTCFullYear(), end.getUTCMonth() + 1, end.getUTCDate());
}

const currentPassword = ref<string>("");

async function reloadData() {
    const ok = await useAuthFetchSync(`/api/share/verify?linkId=${sharedLinkId}&password=${currentPassword.value}`);
    if (ok === true) {
        sharedPassword.value = currentPassword.value;
    } else {
        currentPassword.value = '';
        toast('Error', { description: 'Password wrong', position: 'top-right' });
    }
}

const showDashboard = computed(() => {
    if (!sharedLink.value) return false;
    if (needPassword.value && sharedPassword.value) return true;
    if (!needPassword.value) return true;
    return false;
});

const colorMode = useColorMode()
const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
});



</script>

<template>

    <div class="h-dvh w-full overflow-hidden flex flex-col poppins bg-gray-100 dark:bg-background">
        <div v-if="showDashboard" class="h-dvh w-full overflow-hidden flex flex-col poppins">
            <div class="w-full flex justify-between pl-4 pr-6 py-4 bg-sidebar border-solid border-b-1">
                <div class="flex gap-4">
                    <Popover v-model:open="popoverOpen">
                        <PopoverTrigger as-child>
                            <Button variant="outline">
                                <CalendarIcon class="mr-2 h-4 w-4" />
                                <template v-if="timeValue.start">
                                    <template v-if="timeValue.end">
                                        {{ df.format(timeValue.start.toDate(getLocalTimeZone())) }} - {{
                                            df.format(timeValue.end.toDate(getLocalTimeZone())) }}
                                    </template>

                                    <template v-else>
                                        {{ df.format(timeValue.start.toDate(getLocalTimeZone())) }}
                                    </template>
                                </template>
                                <template v-else>
                                    Pick a date
                                </template>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-auto p-4 flex flex-col items-end relative z-[90]">
                            <div class="flex items-center gap-2">
                                <div class="flex flex-col gap-1">
                                    <Button @click="setDays(1)"> Today </Button>
                                    <Button @click="setDays(7)"> Last week </Button>
                                    <Button @click="setDays(30)"> Last 30 days </Button>
                                    <Button @click="setDays(60)"> Last 60 days </Button>
                                    <Button @click="setDays(90)"> Last 90 days </Button>
                                </div>
                                <RangeCalendar v-model="timeValue" initial-focus :number-of-months="1"
                                    @update:start-value="(startDate) => timeValue.start = startDate" />
                            </div>
                            <Button @click="popoverOpen = false;"> Confirm </Button>
                        </PopoverContent>
                    </Popover>
                    <div class="flex items-center gap-1 poppins bg-border/20 py-1 px-2 rounded-md">
                        <div class="size-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                        <div v-if="live_users != undefined && live_users_status === 'success'">{{ live_users }}</div>
                        <Loader v-else class="!size-4"></Loader>
                        <div> live </div>
                    </div>
                </div>
                <Button @click="isDark = !isDark" variant="outline">
                    <SunIcon v-if="isDark"></SunIcon>
                    <MoonIcon v-else />
                </Button>
            </div>
            <div class="p-4 flex flex-col gap-4 grow poppins overflow-y-auto h-full">
                <Accordion type="single" collapsible class="relative lg:hidden border rounded-xl px-5 bg-card">
                    <AccordionItem value=" top-cards">
                        <AccordionTrigger class="text-md">
                            Top Charts
                        </AccordionTrigger>
                        <AccordionContent>
                            <DashboardTopCards class="grid grid-cols-2" />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <div class="hidden lg:block">
                    <DashboardTopCards />
                </div>


                <ActionableChart></ActionableChart>


                <div class="flex w-full justify-center">
                    <div class="flex w-full gap-4 flex-col xl:flex-row">
                        <LineDataNew :shared-link="sharedLink.toString()" class="flex-1" type="referrers" select />
                        <LineDataNew :shared-link="sharedLink.toString()" class="flex-1" type="pages" select />
                    </div>
                </div>

                <div class="flex w-full justify-center">
                    <div class="flex w-full gap-4 flex-col xl:flex-row">
                        <LineDataNew :shared-link="sharedLink.toString()" class="flex-1" type="countries" select />
                        <LineDataNew :shared-link="sharedLink.toString()" class="flex-1" type="devices" select />
                    </div>
                </div>


                <div
                    class="bg-[url('/planet.png')] bg-center bg-cover rounded-xl min-h-40 lg:min-h-60 flex items-center justify-evenly px-6 lg:px-12">
                    <div class="flex flex-col gap-2 ">
                        <span class="text-lg lg:text-5xl font-semibold text-white">
                            Want these metrics for your website?
                        </span>
                    </div>

                    <div class="flex">
                        <NuxtLink to="https://dashboard.litlyx.com/register" target="_blank">
                            <Button size="lg" class="bg-white text-black hover:bg-gray-200 transition p-8 text-lg">
                                Try for free
                            </Button>
                        </NuxtLink>
                    </div>
                </div>

            </div>
        </div>
        <div v-else class="p-8 flex items-center justify-center h-full flex-col gap-4">
            <label>Enter Password</label>
            <CustomPasswordInput class="w-[60dvw] lg:w-[32dvw]" v-model="currentPassword"></CustomPasswordInput>
            <Button class="w-[60dvw] lg:w-[32dvw]" size="lg" @click="reloadData()"> Enter </Button>
        </div>
    </div>
</template>