<script lang="ts" setup>
import { EllipsisVertical, LockIcon, LogOut, MoonIcon, SunIcon, Settings, Search, Plus, Crown, Sparkles, ChartSpline, ChartColumnIncreasing } from 'lucide-vue-next';
import dateServiceInstance from '~/shared/services/DateService';


const colorMode = useColorMode()
const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
});

const router = useRouter();
const projects = useProjectStore();
const premium = usePremiumStore();

const projectStats = ref<Record<string, any>>({});

const { user, clear } = useUserSession();


const searchInput = ref('')

const filteredItems = computed(() => {
    // Se la ricerca è vuota, mostra tutto
    if (!searchInput.value.trim()) {
        return projects.projects
    }

    // Altrimenti filtra
    return projects.projects.filter(item =>
        item.name.toLowerCase().includes(searchInput.value.toLowerCase())
    )
})



onMounted(() => {
    for (const project of projects.projects) {
        useAuthFetchSync(`/api/project/stats?pid=${project._id.toString()}`).then(data => {
            const parsed = data;
            parsed.chart.labels = parsed.chart.labels.map((e: any) => dateServiceInstance.getChartLabelFromISO(e, 'hour'));
            projectStats.value[project._id.toString()] = data;
        });
    }
});

async function logout() {
    await clear();
    router.push('/login');
}

const feedbackText = ref<string>('');
const feedbackOpen = ref<boolean>(false);
function sendFeedback() {
    useCatch({
        toast: true,
        toastTitle: 'Error sending feedback',
        async action() {
            await useAuthFetchSync('/api/feedback/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: { text: feedbackText.value }
            });
        },
        onSuccess(_, showToast) {
            feedbackOpen.value = false;
            feedbackText.value = '';
            showToast('Feedback sent', { description: 'Feedback sent successfully', position: 'top-right' });
        },
    })
}
</script>

<template>
    <div class="w-full h-dvh flex flex-col p-8 gap-4 overflow-auto poppins bg-gray-100 dark:bg-black">
        <div class="flex w-full flex-col items-center gap-4 md:flex-row md:justify-between poppins mb-8 ">
            <img class="h-[5dvh]" :src="isDark ? 'logo-white.svg' : 'logo-black.svg'">
            <div>
                <div class="flex gap-2">
                    <Button @click="isDark = !isDark" variant="outline" >
                        <SunIcon v-if="isDark"></SunIcon>
                        <MoonIcon v-else/>
                    </Button>

                    <Popover v-model:open="feedbackOpen">
                        <PopoverTrigger>
                            <Button variant="outline"> Feedback </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div class="flex flex-col gap-4">
                                <Label> Share everything with us. </Label>
                                <Textarea v-model="feedbackText" placeholder="Leave your feedback here"
                                    class="resize-none h-24"></Textarea>
                                <Button @click="sendFeedback()"> Send </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="outline">
                                Account
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent :side-offset="10" class="w-56">
                            <DropdownMenuLabel class="truncate px-2">
                                {{ user?.email }}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem @click="logout()">
                                    <LogOut></LogOut>
                                    <span> Log out </span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
        <h1 class="text-[16px] font-semibold lg:text-lg">Workspaces <span
                class="text-[10px] text-muted-foreground">({{`${projects.projects.filter(e =>
                    !e.guest).length}/${premium.planInfo?.features.workspaces === 999 ? 'Unlimited' :
                        (premium.planInfo?.features.workspaces ?? 0)}` }})</span></h1>
        <p class="text-gray-500 text-sm lg:text-md dark:text-gray-400"> Here's a list of all your workspaces. </p>
        <Separator />
        <div class="flex justify-between items-center gap-4">
            <div class="relative">
                <span class="absolute top-1/2 left-2 -translate-y-1/2">
                    <Search class="size-5" />
                </span>
                <Input placeholder="Search Workspace" class="bg-white dark:bg-black pl-10 pr-4 h-10"
                    v-model="searchInput" />
            </div>
            <ProButton title="Add Workspace" link="/create_project"
                :locked="projects.projects.length >= (premium.planInfo?.features.workspaces ?? 0)">
                <Plus />
            </ProButton>

        </div>
        <div v-if="filteredItems.length === 0">
            <PageHeader title="No workspaces found"
                :description="`Seems like the workspace you're looking for doesn't exist, try using another name`" />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <Card v-for="work of filteredItems" :key="work._id.toString()" class="cursor-pointer"
                @click="() => { projects.setActive(work._id.toString()); router.push('/'); }"
                :class="{ 'ring-1 ring-violet-500/50 !bg-violet-500/10': work._id === projects.activeProject?._id }">
                <CardHeader>
                    <CardTitle>{{ work.name }}</CardTitle>
                    <CardAction class="flex flex-row gap-2">
                        <Badge variant="outline" v-if="work.guest">
                            Guest
                        </Badge>
                        <Badge class="border-violet-500/50 bg-violet-400 rounded-sm"
                            v-if="work._id === projects.activeProject?._id">Actual</Badge>
                        <DropdownMenu >
                            <DropdownMenuTrigger @click.stop>
                                <EllipsisVertical class="size-4"/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent class="w-40">
                                <DropdownMenuLabel>{{work.name}}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem @click="projects.setActive(work._id.toString())" :disabled="work._id === projects.activeProject?._id">{{work._id === projects.activeProject?._id?'Actual':'Set Active'}}</DropdownMenuItem>
                                <DropdownMenuItem @click="()=>{projects.setActive(work._id.toString());navigateTo('/settings')}" v-if="!work.guest">Settings</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div v-if="!work.guest && projectStats[work._id.toString()]">
                        <WorkspacesVisitsChart
                            class="h-20 pr-2 w-full border rounded-md flex items-center justify-center"
                            :data="projectStats[work._id.toString()].chart"></WorkspacesVisitsChart>
                    </div>
                    <div v-if="!work.guest && !projectStats[work._id.toString()]"
                        class="h-20 w-full border rounded-md flex items-center justify-center">
                        <Loader></Loader>
                    </div>
                    <div v-if="work.guest">
                        <div class="h-20 w-full border rounded-md flex items-center justify-center">
                            GUEST PROJECT
                        </div>
                    </div>
                    <div class="flex justify-between">
                    <p class="text-sm text-muted-foreground pt-2">Last 24 hours chart</p>
                    </div>
                </CardContent>
                <!-- Sparkles,ChartSpline,ChartColumnIncreasing -->
                <!-- <CardFooter class="flex justify-between gap-4">
                    <div v-if="work.guest" class="flex flex-row gap-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <ChartSpline class="size-4"
                                        :class="{ 'text-yellow-500': projects.permissions?.webAnalytics }" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span>Web Analytics <strong>{{ projects.permissions?.webAnalytics ? 'Active' :
                                            'Disabled'
                                            }}</strong></span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <ChartColumnIncreasing class="size-4"
                                        :class="{ 'text-yellow-500': projects.permissions?.events }" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span>Web Analytics <strong>{{ projects.permissions?.events ? 'Active' : 'Disabled'
                                            }}</strong></span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Sparkles class="size-4" :class="{ 'text-yellow-500': projects.permissions?.ai }" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span>
                                        AI Assistant
                                        <strong>{{ projects.permissions?.ai ? 'Active' : 'Disabled' }}
                                        </strong>
                                    </span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                </CardFooter> -->
            </Card>



        </div>
    </div>



</template>