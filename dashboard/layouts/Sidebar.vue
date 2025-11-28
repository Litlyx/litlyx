<script setup lang="ts">
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'

import { Funnel, Link, Lock, MessageCircleMoreIcon } from 'lucide-vue-next'
import LiveUsers from '~/components/dashboard/LiveUsers.vue';

const domainStore = useDomainStore();
const premium = usePremiumStore();

const projectStore = useProjectStore();

const sidebarHeaderVisible = computed(() => {
    if (domainStore.domains.length == 0) return false;
    return true;
});

const { data: plan } = await useAuthFetch('/api/user/plan');

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
    <SidebarProvider class="h-dvh">
        <AppSidebar />
        <SidebarInset>
            <SidebarTrigger v-if="!projectStore.firstInteraction" class="ml-2 mt-2 lg:hidden" />
            <header v-if="projectStore.firstInteraction" class="bg-sidebar border-border py-2 px-2 flex gap-2"
                :class="{ 'border-b-2': sidebarHeaderVisible }">

                <SidebarTrigger class="ml-2 md:mt-1 lg:hidden" />

                <Drawer>
                    <DrawerTrigger class="lg:hidden"><Button variant="outline">
                            <Funnel class="size-4" /> Filters
                        </Button></DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader class="flex flex-row justify-between">
                            <div>
                                <DrawerTitle>Filters</DrawerTitle>
                                <DrawerDescription>Filter between your domains and select your Snapshot
                                </DrawerDescription>
                            </div>
                            <div>
                                <DrawerClose>
                                    <Button>
                                        Cancel
                                    </Button>
                                </DrawerClose>
                            </div>

                        </DrawerHeader>
                        <div class="flex flex-row gap-4 justify-center p-4">
                            <SelectorDomainSelector v-if="sidebarHeaderVisible" class="w-[15rem]" />
                            <SelectorSnapshotSelector v-if="sidebarHeaderVisible" class="w-[15rem]" />
                        </div>
                        <DrawerFooter>

                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>



                <SelectorDomainSelector v-if="sidebarHeaderVisible" class="w-[15rem] hidden lg:flex" />
                <SelectorSnapshotSelector v-if="sidebarHeaderVisible" class="w-[15rem] hidden lg:flex" />
                <div class="flex items-center justify-end grow pr-4 gap-4">
                    <NuxtLink to="https://docs.litlyx.com" target="_blank"> Docs </NuxtLink>

                    <Popover v-if="!isSelfhosted()" v-model:open="feedbackOpen">
                        <PopoverTrigger as-child>
                            <Button @click.prevent.stop variant="ghost" size="sm"
                                class="hover:!bg-sidebar-accent flex justify-start font-normal">
                                <MessageCircleMoreIcon class="size-4 text-muted-foreground" />
                                Feedback
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent side="bottom" :side-offset='16'>
                            <div class="flex flex-col gap-4">
                                <Label>Share everything with us.</Label>
                                <Textarea v-model="feedbackText" placeholder="Leave your feedback here"
                                    class="resize-none h-24" />
                                <Button @click="sendFeedback()">Send</Button>
                                <div class="text-center">
                                    or email us at 
                                    <a class="underline" href="mailto:help@litlyx.com">help@litlyx.com</a>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <TooltipProvider v-if="!isSelfhosted()">
                        <Tooltip>
                            <TooltipTrigger>
                                <NuxtLink
                                    :to="[0].includes(premium.planInfo?.ID ?? -1) ? '/plans' : '/shareable_links'">
                                    <Button variant="outline" :disabled="[0].includes(premium.planInfo?.ID ?? -1)">
                                        <Lock v-if="[0].includes(premium.planInfo?.ID ?? -1)"
                                            class="size-4 text-yellow-500" />
                                        <Link v-else class="size-4" />
                                        Share
                                    </Button>
                                </NuxtLink>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p> Share your project </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>


                    <!-- <Popover v-model:open="feedbackOpen">
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
                    </Popover> -->


                    <!-- <Popover v-model:open="helpOpen">
                        <PopoverTrigger>
                            <div class="cursor-pointer"> Help </div>
                        </PopoverTrigger>
                        <PopoverContent :side-offset="10">
                            <div class="flex flex-col gap-4">
                                <Label> Contact support </Label>
                                <Label class="text-muted-foreground">
                                    If you have any question or issue we are here to help you
                                </Label>
                                <div>
                                    <div class="border-solid border-[1px] rounded-md px-2 py-1 relative">
                                        <CopyIcon @click="copyEmail()"
                                            class="size-4 absolute right-2 top-2 cursor-pointer"></CopyIcon>
                                        <div class="poppins text-[.9rem]"> help@litlyx.com </div>
                                    </div>
                                </div>
                                <Label class="text-muted-foreground">
                                    or text us on Discord, we will reply to you personally.
                                </Label>
                                <NuxtLink to="https://discord.gg/tg7FHkffR7" target="_blank">
                                    <Button variant="outline" size="sm" class="w-full">
                                        <Icon class="text-2xl" name="ic:baseline-discord"></Icon>
                                    </Button>
                                </NuxtLink>
                            </div>
                        </PopoverContent>
                    </Popover> -->

                </div>
            </header>

            <div v-if="sidebarHeaderVisible" class="min-h-52 overflow-auto h-full">
                <div v-if="plan && !(plan.premium_type === 7999 && !projectStore.activeProject?.guest)"
                    class="flex flex-1 flex-col gap-4 p-4 overflow-y-auto h-full bg-gray-100 dark:bg-background">
                    <slot></slot>
                </div>
                <div v-else>
                    <LazyFreeTrialEnded></LazyFreeTrialEnded>
                </div>
            </div>

            <div v-if="!sidebarHeaderVisible" class="flex justify-center mt-[20vh] text-[1.3rem] poppins font-medium">
                <Unauthorized authorization="At least 1 domain"
                    v-if="!domainStore.domainPending && domainStore.domains.length == 0">
                </Unauthorized>
                <div v-else>
                    <Loader></Loader>
                </div>
            </div>
        </SidebarInset>
    </SidebarProvider>

</template>