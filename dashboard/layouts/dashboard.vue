<script setup lang="ts">

import type { Section } from '~/components/layout/VerticalNavigation.vue';

import { Lit } from 'litlyx-js';
import { DialogFeedback } from '#components';

const { userRoles, isLogged } = useLoggedUser();
const { project } = useProject();

const modal = useModal();

const selfhosted = useSelfhosted();

const sections: Section[] = [
    {
        title: '',
        entries: [
            { label: 'Web Analytics', to: '/', icon: 'fal fa-table-layout' },
            { label: 'Custom Events', to: '/events', icon: 'fal fa-square-bolt' },
            { label: 'Members', to: '/members', icon: 'fal fa-users' },
            { label: 'Ask AI', to: '/analyst', icon: 'fal fa-sparkles' },

            // { label: 'Security', to: '/security', icon: 'fal fa-shield', disabled: selfhosted },
            // { label: 'Insights (soon)', to: '#', icon: 'fal fa-lightbulb', disabled: true },
            // { label: 'Links (soon)', to: '#', icon: 'fal fa-globe-pointer', disabled: true },
            // { label: 'Integrations (soon)', to: '/integrations', icon: 'fal fa-cube', disabled: true },

            { grow: true, label: 'Settings', to: '/settings', icon: 'fal fa-gear' },
            // {
            //     grow: true,
            //     label: 'Leave a Feedback', icon: 'fal fa-message',
            //     action() {
            //         modal.open(DialogFeedback, {});
            //     },
            //     disabled: selfhosted
            // },
            // {
            //     grow: true,
            //     label: 'Documentation', to: 'https://docs.litlyx.com', icon: 'fal fa-book', external: true,
            //     action() { Lit.event('docs_clicked') },
            // },
            // {
            //     grow: true,
            //     label: 'Discord support', icon: 'fab fa-discord',
            //     to: 'https://discord.gg/9cQykjsmWX',
            //     external: true,
            // },
            // {
            //     label: 'Slack support', icon: 'fab fa-slack',
            //     to: '#',
            //     premiumOnly: true,
            //     action() {
            //         if (isLogged.value === true) return;
            //         if (userRoles.isPremium.value === true) {
            //             window.open('https://join.slack.com/t/litlyx/shared_invite/zt-2q3oawn29-hZlu_fBUBlc4052Ooe3FZg', '_blank');
            //         } else {
            //             pricingDrawer.visible.value = true;
            //         }
            //     },
            // },
        ]
    }
];


const { showDialog, closeDialog } = useBarCardDialog();

const { isOpen, close, open } = useMenu();

</script>


<template>

    <div class="layout relative flex flex-col min-h-[100dvh] h-dvh w-dvw overflow-hidden">


        <div
            class="px-6 py-3 flex items-center justify-center dark:bg-lyx-background-light z-[20] rounded-xl mx-2 my-2 lg:hidden">
            <i @click="open()" class="fas fa-bars text-[1.2rem] absolute left-6"></i>
            <!-- <div class="nunito font-semibold text-[1.2rem]">
                Litlyx
            </div> -->
        </div>

        <div class="flex h-full overflow-y-hidden">


            <div v-if="isOpen" @click="close()"
                class="lg:hidden barrier bg-black/40 backdrop-blur-[2px] w-full h-full absolute left-0 top-0 z-[40]">
            </div>


            <LayoutVerticalNavigation :sections="sections">
            </LayoutVerticalNavigation>


            <div class="flex flex-col overflow-hidden w-full bg-lyx-lightmode-background dark:bg-lyx-background relative h-full">

                <div v-if="showDialog" class="barrier w-full h-full z-[34] absolute bg-black/50 backdrop-blur-[2px]">
                    <i
                        class="z-[40] absolute right-12 top-8 fas fa-times text-lyx-lightmode-text-dark dark:text-text-sub text-[1.8rem] lg:text-[3rem]"></i>
                </div>

                <div @click="closeDialog()" class="w-full h-full z-[35] absolute top-0 left-0 px-4 lg:px-60 py-20"
                    v-if="showDialog">
                    <DashboardDialogBarCard @click.stop="null" class="z-[36]"></DashboardDialogBarCard>
                </div>

                <LayoutTopNavigation class="flex shrink-0"></LayoutTopNavigation>

                <div class="flex-1 overflow-auto">
                    <slot></slot>
                </div>

            </div>
        </div>

    </div>

</template>
