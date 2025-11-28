<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import NavMain from './NavMain.vue'
import NavProjects from './NavProjects.vue'
import NavUser from './NavUser.vue'
import TeamSwitcher from './ProjectSwitcher.vue'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import SidebarData from './SidebarData.vue'
import { Box } from 'lucide-vue-next'

const { plan } = usePremiumStore();

const props = withDefaults(defineProps<SidebarProps>(), { collapsible: 'icon' });

const { user } = useUserSession();

const userLogo = true;

const userData = computed(() => {
  return {
    name: 'noname',
    avatar: '',
    email: user.value?.email || 'nomail'
  }
})

const debugMode = false;//process.dev;

const projectStore = useProjectStore();
const colorMode = useColorMode()


async function leaveProject() {
  await useAuthFetchSync('/api/members/leave');
  await projectStore.fetchProjects();
}

async function acceptInvite(project_id: string) {
  await useCatch({
    toast: true,
    toastTitle: 'Error accepting invite',
    async action() {
      await useAuthFetchSync('/api/members/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { project_id }
      })
    },
    async onSuccess() {
      await projectStore.fetchProjects();
      await projectStore.fetchPendingInvites();
      const newActive = projectStore.projects.at(-1)?._id.toString();
      if (newActive) await projectStore.setActive(newActive);
    },
  });
}

async function declineInvite(project_id: string) {
  await useCatch({
    toast: true,
    toastTitle: 'Error declining invite',
    async action() {
      await useAuthFetchSync('/api/members/decline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { project_id }
      })
    },
    onSuccess() {
      projectStore.fetchPendingInvites();
    },
  });
}

</script>

<template>
  <Sidebar v-bind="props" variant="sidebar">
    <SidebarHeader class="px-0">
      <div class="border-b-2 ">
        <div class="px-2 flex items-center justify-center my-4 gap-4">
          <NuxtLink to="/"><img class="h-6" :src="colorMode.value === 'dark' ? '/logo-white.svg' : '/logo-black.svg'"></NuxtLink>
        </div>
      </div>
      <!-- <ProjectSwitcher /> -->
    </SidebarHeader>
    <SidebarContent>
      <SidebarData></SidebarData>
      <div v-if="debugMode"
        class="bg-red-500/70 text-white text-[.8rem] flex font-bold mx-4 p-2 px-4 rounded-md z-[100]">
        <div class="poppins mr-4"> DEV </div>
        <div class="poppins flex sm:hidden"> XS </div>
        <div class="poppins hidden sm:max-md:flex"> SM - MOBILE </div>
        <div class="poppins hidden md:max-lg:flex"> MD - TABLET </div>
        <div class="poppins hidden lg:max-xl:flex"> LG - LARGE </div>
        <div class="poppins hidden xl:max-2xl:flex"> XL - EXTRA LARGE </div>
        <div class="poppins hidden 2xl:flex"> 2XL - WIDE SCREEN </div>
      </div>
    </SidebarContent>
    <SidebarFooter>

      <SidebarBanner
        v-if="plan && ((plan.premium_type === 7006 || plan.premium_type === 0) || plan.payment_failed || plan.canceled) && projectStore.isOwner"
        class="w-full">
      </SidebarBanner>

      <div class="border border-violet-500/50 dark:bg-violet-500/10 rounded-lg py-2 px-4 flex flex-col gap-4 mt-4"
        v-if="projectStore.pendingInvites.length > 0">
        <div class="text-[.9rem]">
          You have been invited to
          <b>{{ projectStore.pendingInvites[0].project_name }} </b>
        </div>
        <div class="flex gap-2 justify-between">
          <Button @click="declineInvite(projectStore.pendingInvites[0].project_id)" size="sm" variant="ghost">
            Decline </Button>
          <Button @click="acceptInvite(projectStore.pendingInvites[0].project_id)" size="sm"> Accept </Button>
        </div>
      </div>

      <Button @click="leaveProject()" class="my-4" v-if="!projectStore.isOwner" variant="outline">
        Leave project
      </Button>

      <NavUser :user="userData" />
    </SidebarFooter>
  </Sidebar>
</template>