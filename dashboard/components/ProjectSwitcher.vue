<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import { ChevronsUpDown, Layers2, Package, Plus } from 'lucide-vue-next'

const projectStore = useProjectStore();
const premiumStore = usePremiumStore();

const router = useRouter();
const { isMobile } = useSidebar()

function gotoAddProject() {
  router.push('/create_project')
}

</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <Skeleton v-if="!projectStore.activeProject" class="w-full h-12 p-2"></Skeleton>
      <DropdownMenu v-if="projectStore.activeProject">
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton size="lg"
            class="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar">
              <Package v-if="projectStore.activeProject.guest"></Package>
              <Layers2 v-if="!projectStore.activeProject.guest"></Layers2>
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span v-if="projectStore.pid" class="truncate font-medium">
                {{ projectStore.activeProject.name }}
              </span>
              <span class="truncate text-xs text-gray-400">
                {{ projectStore.activeProject.guest ? 'Guest' : 'Owned' }}
              </span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent v-if="premiumStore.planInfo" class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start"
          :side="isMobile ? 'bottom' : 'right'" :side-offset="4">
          <DropdownMenuLabel class="text-xs text-gray-500 dark:text-gray-400">
            Workspaces <span>{{ projectStore.projects.length }}/{{premiumStore.planInfo?.features.workspaces === 999 ? 'Unlimited' : (premiumStore.planInfo?.features.workspaces ?? 0)}}</span>
          </DropdownMenuLabel>
          <DropdownMenuItem v-for="item in projectStore.projects" :key="item.name" class="gap-2 p-2"
            @click="projectStore.setActive(item._id.toString())">
            <div class="flex size-6 items-center justify-center rounded-sm border">
              <Package v-if="item.guest"></Package>
              <Layers2 v-if="!item.guest"></Layers2>
            </div>
            {{ item.name }}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem v-if="projectStore.projects.length >= premiumStore.planInfo.features.workspaces" class="gap-2 p-2" asChild>
            <ProDropdown/>
          </DropdownMenuItem>
          <DropdownMenuItem v-else @click="gotoAddProject()" class="gap-2 p-2">
            <div
              class="flex size-6 items-center justify-center rounded-md border border-gray-200 bg-transparent dark:border-gray-800">
              <Plus class="size-4" />
            </div>
            <div class="font-medium">
              Add workspace
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
