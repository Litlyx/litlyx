<script setup lang="ts">
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { ChartSpline, LayoutPanelLeft, Layers2, Download, ChartColumnIncreasing, Sparkles, UsersRound, FileChartLine, Settings, Shield, ChevronRight, Lock } from 'lucide-vue-next'
import LiveUsers from '~/components/dashboard/LiveUsers.vue';

const { toggleSidebar, isMobile } = useSidebar();

const route = useRoute();

const projectStore = useProjectStore();
const premiumStore = usePremiumStore();


const openIndex = ref<number | null>(null) // nessuna sezione aperta all’inizio

const toggle = (index: number) => {
    openIndex.value = openIndex.value === index ? null : index
}

// childs:[]
const items = ref([
    {
        url: '/',
        text: 'Web Analytics',
        icon: ChartSpline,
        disable_action: false,
        disabled: computed(() => !projectStore.permissions?.webAnalytics)
    },
    {
        url: '/events',
        text: 'Custom Events',
        icon: ChartColumnIncreasing,
        disable_action: false,
        disabled: computed(() => !projectStore.permissions?.events)
    },
    {
        url: '/reports',
        text: 'Reports',
        icon: Download,
        disable_action: false,
        disabled: computed(() => !projectStore.isOwner || !projectStore.firstInteraction)
    },
    {
        url: '/members',
        text: 'Members',
        icon: UsersRound,
        disable_action: [0, 7006, 8001, 8002].includes(premiumStore.planInfo?.ID ?? -1),
        disabled: computed(() => !projectStore.isOwner || [0, 7006, 8001, 8002].includes(premiumStore.planInfo?.ID ?? -1))
    },
    {
        url: '/shields',
        text: 'Shields',
        icon: Shield,
        disable_action: false,
        disabled: computed(() => !projectStore.isOwner)
    },
    {
        url: '/settings',
        text: 'Settings',
        icon: Settings,
        disable_action: false,
        disabled: computed(() => !projectStore.isOwner)

    },
    {
        url: '/ai',
        text: 'AI Assistant',
        icon: Sparkles,
        color: 'text-yellow-500',
        disable_action: [0].includes(premiumStore.planInfo?.ID ?? -1),
        disabled: computed(() => !projectStore.permissions?.ai || [0].includes(premiumStore.planInfo?.ID ?? -1))
    }
])

onMounted(() => {
    if (!isAiEnabled()) {
        items.value.splice(-1);
        items.value.splice(2, 1);
    }
})

</script>

<template>
    <ProjectSwitcherMini />
    <SidebarGroup class="group-data-[collapsible=icon]:hidden poppins">
        <!-- <SidebarGroupLabel>Cose</SidebarGroupLabel> -->
        <SidebarMenu>
            <SidebarGroupLabel class="flex justify-between gap-4 px-0">

                <Badge variant="outline" class="truncate max-w-40 font-medium">
                    {{ projectStore?.activeProject?.name || 'Project' }}
                </Badge>


                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <LiveUsers v-if="projectStore?.firstInteraction"></LiveUsers>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Online users at current time</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </SidebarGroupLabel>
            <SidebarMenuItem v-for="item in items" :key="item.text">
                <SidebarMenuButton asChild @click="isMobile && toggleSidebar()" :disabled="item.disabled === true">
                    <NuxtLink :to="item.disabled === true ? '' : item.url" :class="{
                        'bg-sidebar-accent': route.path === item.url,
                        '!cursor-default !pointer-events-none !opacity-30 text-sidebar-accent-foreground font-light': item.disabled === true

                    }" class="flex justify-between" as-child>
                        <div class="flex flex-row gap-2">
                            <component :is="item.icon" class="size-4" :class="item.color ?? item.color" />

                            <span>{{ item.text }}</span>
                        </div>

                        <SidebarMenuBadge v-if="item.disable_action">
                            <Lock class="size-4 text-yellow-500" />
                        </SidebarMenuBadge>
                    </NuxtLink>
                </SidebarMenuButton>
            </SidebarMenuItem>

            <Card v-if="isSelfhosted() && !isAiEnabled()" class="p-2! mt-4">
                <div class="flex flex-col gap-2">
                    <div class="text-center text-xs">
                        To unlock AI features, make sure you’ve added a valid AI_KEY, AI_ORG, and AI_PROJECT inside your
                        docker-compose.yml.
                    </div>
                    <NuxtLink to="https://docs.litlyx.com" target="_blank" class="text-xs text-center text-blue-400">
                        View Documentation
                    </NuxtLink>
                </div>
            </Card>

        </SidebarMenu>
        <!-- <SidebarMenu>
                        <SidebarGroupLabel class="flex justify-between gap-4 px-0">
                <span class="truncate">{{ projectStore?.activeProject?.name || 'Project' }}</span>
                <LiveUsers v-if="projectStore?.firstInteraction" class="hidden lg:flex"></LiveUsers>
            </SidebarGroupLabel>
            <SidebarMenuItem v-for="(item, index) in items" :key="index">
                
                <Collapsible v-if="item.url === ''" :open="openIndex === index">
                    <CollapsibleTrigger as-child :disabled="item.disabled === true" :class="{
                        'bg-sidebar-accent/50': item.childs && item.childs.some(child => route.path === child.url),
                        '!cursor-default !text-muted-foreground hover:!bg-sidebar': item.disabled === true
                    }" @click="toggle(index)">
                        <SidebarMenuButton>
                            <div class="flex items-center justify-between w-full">
                                <div class="flex items-center gap-2">
                                    <component :is="item.icon" class="size-4" />
                                    <span>{{ item.text }}</span>
                                </div>
                                
                                <ChevronRight class="h-4 w-4 transition-transform duration-200"
                                    :class="{ 'rotate-90': openIndex === index }" />
                            </div>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem v-for="child in item.childs" :key="child.url">
                                <SidebarMenuSubButton as-child @click="isMobile && toggleSidebar()">
                                    <NuxtLink :to="child.disabled === true ? '' : child.url" :class="{
                                        'bg-sidebar-accent': route.path === child.url,
                                        '!cursor-default !text-muted-foreground hover:!bg-sidebar': child.disabled === true
                                    }" class="flex justify-between">
                                        <div class="flex flex-row gap-2">
                                            <component :is="child.icon" class="size-4" />
                                            <span>{{ child.text }}</span>
                                        </div>
                                    </NuxtLink>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>

                <template v-else>
                    <SidebarMenuButton asChild @click="isMobile && toggleSidebar()" :disabled="item.disabled === true">
                        <NuxtLink :to="item.disabled === true ? '' : item.url" :class="{
                            'bg-sidebar-accent': route.path === item.url,
                            '!cursor-default !pointer-events-none !opacity-30 text-sidebar-accent-foreground font-light': item.disabled === true

                        }" class="flex justify-between" as-child>
                            <div class="flex flex-row gap-2">
                                <component :is="item.icon" class="size-4" :class="item.color ?? item.color" />
                                <span>{{ item.text }}</span>
                            </div>

                        </NuxtLink>
                    </SidebarMenuButton>
                </template>
</SidebarMenuItem>
</SidebarMenu> -->

    </SidebarGroup>
</template>
