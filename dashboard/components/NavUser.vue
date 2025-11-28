<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { BadgeCheck, CopyIcon, HelpCircle, Bell, MessageCircleMoreIcon, CatIcon, ChevronsUpDown, CreditCard, LogOut, MoonIcon, Sparkles, SunIcon, User, UserIcon, Wallet, } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
const props = defineProps<{
  user: {
    name: string,
    email: string,
    avatar: string,
  }
}>()

const { planInfo } = usePremiumStore();
const projectStore = useProjectStore();

const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const { isMobile } = useSidebar()

const { clear } = useUserSession()
const router = useRouter();

async function logout() {
  await clear();
  router.push('/login');
}

const helpOpen = ref<boolean>(false);


function copyEmail() {
  if (!navigator.clipboard) return toast.error('Error', { position: 'top-right', description: 'Error copying' });
  navigator.clipboard.writeText("help@litlyx.com");
  toast.info('Email copied', { description: 'Email is now in your clipboard', position: 'top-right' });
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="user.avatar" :alt="user.email" />
              <AvatarFallback class="rounded-lg">
                {{ user.email.substring(0, 1) }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user.email }}</span>
              <span class="truncate text-xs" v-if="planInfo">
                {{ (planInfo.NAME ?? '???') }}
              </span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-56 max-w-[240px] rounded-lg"
          :side="isMobile ? 'bottom' : 'top'" align="center" :side-offset="12">
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="user.avatar" :alt="user.email" />
                <AvatarFallback class="rounded-lg">
                  {{ user.email.substring(0, 1) }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user.email }}</span>
                <span class="truncate text-xs" v-if="planInfo">
                  {{ planInfo.NAME ?? '???' }}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <!-- <DropdownMenuGroup>
            <DropdownMenuItem>
              <Sparkles />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup> -->

          <!-- <DropdownMenuSeparator /> -->

          <DropdownMenuGroup>
            <NuxtLink to="/account">
              <DropdownMenuItem>
                <div class="flex items-center gap-2">
                  <UserIcon />
                  Account
                </div>
              </DropdownMenuItem>
            </NuxtLink>

          </DropdownMenuGroup>



          <DropdownMenuGroup v-if="projectStore.isOwner">

            <DropdownMenuSeparator />

            <NuxtLink v-if="!isSelfhosted()" to="/plans">
              <DropdownMenuItem>
                <div class="flex items-center gap-2">
                  <CreditCard />
                  Plans
                </div>
              </DropdownMenuItem>
            </NuxtLink>

            <NuxtLink to="/billing">
              <DropdownMenuItem>
                <div class="flex items-center gap-2">
                  <Wallet />
                  Billing
                </div>
              </DropdownMenuItem>
            </NuxtLink>

          </DropdownMenuGroup>

          <DropdownMenuSeparator />





          <DropdownMenuGroup>

            <DropdownMenuItem as-child>
              <Popover v-model:open="helpOpen">
                <PopoverTrigger as-child>
                  <Button @click.prevent.stop variant="ghost" size="sm"
                    class="hover:!bg-sidebar-accent w-full flex justify-start font-normal">
                    <HelpCircle class="size-4 text-muted-foreground" />
                    Help
                  </Button>
                </PopoverTrigger>

                <PopoverContent side="right" :side-offset='16'>
                  <div class="flex flex-col gap-4">
                    <Label> Contact support </Label>
                    <Label class="text-muted-foreground">
                      If you have any question or issue we are here to help you
                    </Label>
                    <div>
                      <div class="border-solid border-[1px] rounded-md px-2 py-1 relative">
                        <CopyIcon @click="copyEmail()" class="size-4 absolute right-2 top-2 cursor-pointer"></CopyIcon>
                        <div class="poppins text-[.9rem]"> help@litlyx.com </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </DropdownMenuItem>

            <NuxtLink to="https://discord.gg/tg7FHkffR7" target="_blank">
              <DropdownMenuItem>
                <div class="flex items-center gap-2">
                  <Icon class="text-xl text-gray-400" name="ic:baseline-discord"></Icon>
                  Discord support
                </div>
              </DropdownMenuItem>
            </NuxtLink>

          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>

            <DropdownMenuItem @click="isDark = !isDark">
              <div class="flex items-center gap-2">
                <SunIcon v-if="isDark" />
                <MoonIcon v-if="!isDark" />
                Switch theme
              </div>
            </DropdownMenuItem>


            <NuxtLink to="/admin">
              <DropdownMenuItem v-if="user.email === 'helplitlyx@gmail.com'">
                <div class="flex items-center gap-2">
                  <CatIcon></CatIcon>
                  Admin panel
                </div>
              </DropdownMenuItem>
            </NuxtLink>

          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem @click="logout()">
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
