<script setup lang="ts">

import type { Section } from '~/components/CVerticalNavigation.vue';

const router = useRouter();
const { setToken } = useAccessToken();

import { Lit } from 'litlyx-js';

const sections: Section[] = [
    {
        title: 'General',
        entries: [
            { label: 'Projects', icon: 'far fa-table-layout', to: '/project_selector' },
            // { label: 'Members', icon: 'far fa-users', to: '/members' },
            { label: 'Admin', icon: 'fas fa-cat', adminOnly: true, to: '/admin' },
        ]
    },
    {
        title: 'Project',
        entries: [
            { label: 'Dashboard', to: '/', icon: 'far fa-table-layout' },
            { label: 'Events', to: '/events', icon: 'far fa-bolt' },
            { label: 'Analyst', to: '/analyst', icon: 'far fa-microchip-ai' },
            { label: 'Settings', to: '/settings', icon: 'far fa-gear' },
            // { label: 'Report', to: '/report', icon: 'far fa-notes' },
            // { label: 'AI', to: '/dashboard/settings', icon: 'far fa-robot brightness-[.4]' },
            // { label: 'Visits', to: '/dashboard/visits', icon: 'far fa-eye' },
            // { label: 'Events', to: '/dashboard/events', icon: 'far fa-line-chart' },
        ]
    },
    {
        title: 'Non si vede',
        entries: [
            {
                label: 'Docs', to: 'https://docs.litlyx.com', icon: 'far fa-book-open', external: true,
                action() { Lit.event('docs_clicked') },
            },
            // {
            //     label: 'Github', to: 'https://github.com/litlyx/litlyx', icon: 'fab fa-github', external: true,
            //     action() { Lit.event('git_clicked') },
            // },
            // { label: 'Billing', to: '/plans', icon: 'far fa-wallet' },
            // { label: 'Book a demo', to: '/book_demo', icon: 'far fa-calendar' },
        ]
    }
];

const { showDialog, closeDialog } = useBarCardDialog();

const { isOpen, close, open } = useMenu();

</script>


<template>

    <div class="layout relative flex flex-col min-h-[100dvh] h-dvh w-dvw overflow-hidden">


        <div
            class="px-6 py-3 flex items-center justify-center shadow-[0_0_10px_#000000CC] z-[20] rounded-xl mx-2 my-2 lg:hidden">
            <i @click="open()" class="fas fa-bars text-[1.2rem] absolute left-6"></i>
            <div class="nunito font-semibold text-[1.2rem]">
                Litlyx
            </div>
        </div>

        <div class="flex h-full">


            <div v-if="isOpen" @click="close()"
                class="lg:hidden barrier bg-black/40 backdrop-blur-[2px] w-full h-full absolute left-0 top-0 z-[40]">
            </div>


            <CVerticalNavigation :sections="sections">
            </CVerticalNavigation>


            <div class="overflow-hidden w-full bg-lyx-background-light relative h-full">

                <div v-if="showDialog" class="barrier w-full h-full z-[34] absolute bg-black/50 backdrop-blur-[2px]">
                    <i
                        class="z-[40] absolute right-12 top-8 fas fa-times text-text-sub text-[1.8rem] lg:text-[3rem]"></i>
                </div>

                <div @click="closeDialog()" class="w-full h-full z-[35] absolute top-0 left-0 px-4 lg:px-60 py-20"
                    v-if="showDialog">
                    <DashboardDialogBarCard @click.stop="null" class="z-[36]"></DashboardDialogBarCard>
                </div>

                <slot></slot>
            </div>
        </div>

    </div>

</template>
