<script setup lang="ts">

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

import { ChevronsUpDown, Settings } from 'lucide-vue-next'

const domainStore = useDomainStore();


const filterDomains = ref<string>('');
const domainsFiltered = computed(() => {
    if (filterDomains.value.length == 0) return domainStore.domains;
    return domainStore.domains.filter(e => e.name.includes(filterDomains.value));
})

const { containerProps, wrapperProps, list } = useVirtualList(domainsFiltered, { itemHeight: 36 });


const { isMobile } = useSidebar()

const router = useRouter();



</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <Skeleton v-if="!domainStore.activeDomain" class="w-full h-12 px-2"></Skeleton>
            <DropdownMenu v-if="domainStore.activeDomain">
                <DropdownMenuTrigger as-child>
                    <SidebarMenuButton size="lg"
                        class="px-4 cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                        <!-- <div
                            class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                            <Cat></Cat>
                        </div> -->
                        <div class="grid flex-1 text-left text-sm leading-tight">
                            <span v-if="domainStore.activeDomain" class="truncate font-medium">
                                {{ domainStore.activeDomain.name }}
                            </span>
                            <!-- <span v-if="snapshotStore.from && snapshotStore.to" class="truncate text-xs text-gray-400">
                                {{ new Date(snapshotStore.from).toLocaleDateString() }} to {{ new Date(snapshotStore.to).toLocaleDateString() }}
                            </span> -->
                        </div>
                        <ChevronsUpDown class="ml-auto" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-[23rem] rounded-lg" align="start"
                    :side="isMobile ? 'bottom' : 'right'" :side-offset="4">

                    <DropdownMenuLabel class="text-xs text-gray-500 dark:text-gray-400">
                        Domains
                    </DropdownMenuLabel>

                    <div class="my-2">
                        <Input v-model="filterDomains" placeholder="Filter Domains" @keydown.stop type="text"></Input>
                    </div>

                    <div v-bind="containerProps" class="max-h-[20rem]">
                        <div class="flex flex-col" v-bind="wrapperProps">
                            <DropdownMenuItem class="h-[36px]" v-for="item in list" :key="item.data.name"
                                :class="{ 'bg-sidebar-accent/50': item.data.name === domainStore.activeDomain.name }"
                                @click="domainStore.setActive(item.data._id.toString())">
                                {{ item.data.name }}
                            </DropdownMenuItem>
                        </div>
                    </div>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="gap-2 p-2" @click="router.push('/settings?tab=domains')">
                        <div
                            class="flex size-6 items-center justify-center rounded-md border border-gray-200 bg-transparent dark:border-gray-800">
                            <Settings class="size-4" />
                        </div>
                        <div class="font-medium">
                            Manage domains
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    </SidebarMenu>
</template>
