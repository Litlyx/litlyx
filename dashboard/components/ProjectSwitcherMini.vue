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

import { ChevronsUpDown, Layers2, Layers3, Package, Plus } from 'lucide-vue-next'

const projectStore = useProjectStore();
const premiumStore = usePremiumStore();

const router = useRouter();
const { isMobile } = useSidebar()

function gotoAddProject() {
  router.push('/create_project')
}

</script>

<template>
  <SidebarMenu class="w-full px-2">
    <SidebarMenuItem>
      <Skeleton v-if="!projectStore.activeProject" class="w-full h-12 p-2"></Skeleton>

      <DropdownMenu v-if="projectStore.activeProject">

        <DropdownMenuTrigger as-child>

          <SidebarMenuButton size="lg"
            class="flex  justify-between cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">

            <div class="flex aspect-square size-8 justify-center bg-violet-500/40 items-center rounded-lg gap-4">

              <Package v-if="projectStore.activeProject.guest" class="size-5"></Package>
              <Layers2 v-if="!projectStore.activeProject.guest" class="size-5"></Layers2>
            </div>
            <span class="text-muted-foreground poppins ">Workspaces</span>

            <ChevronsUpDown />
          </SidebarMenuButton>

        </DropdownMenuTrigger>

        <DropdownMenuContent v-if="premiumStore.planInfo"
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start"
          :side="isMobile ? 'bottom' : 'right'" :side-offset="4">
          <DropdownMenuLabel class="text-xs text-gray-500 dark:text-gray-400">
            Workspaces <span>{{projectStore.projects.filter(e =>
              !e.guest).length}}/{{ premiumStore.planInfo?.features.workspaces === 999 ? 'Unlimited' :
                (premiumStore.planInfo?.features.workspaces ?? 0)}}</span>
          </DropdownMenuLabel>
          <DropdownMenuItem class="gap-2 p-2 " @click="router.push('/workspaces')">
            <div class="flex size-6 items-center justify-center rounded-sm border">
              <Layers3 />
            </div>
            All Workspaces
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem v-for="item in projectStore.projects" :key="item.name" class="gap-2 my-1"
            @click="() => { projectStore.setActive(item._id.toString()); }"
            :class="{ 'bg-sidebar-accent/50': item.name === projectStore.activeProject.name }">
            <div class="flex size-6 items-center justify-center rounded-sm border">
              <Package v-if="item.guest"></Package>
              <Layers2 v-if="!item.guest"></Layers2>
            </div>
            {{ item.name }}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem v-if="projectStore.projects.length >= premiumStore.planInfo.features.workspaces"
            class="gap-2 p-2" asChild>
            <ProDropdown />
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
