<script lang="ts" setup>

import { DialogFeedback, DialogHelp } from '#components';

const modal = useModal();
const selfhosted = useSelfhosted();

const { domain } = useDomain();

const colorMode = useColorMode()
const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})

const { safeSnapshotDates } = useSnapshot();

</script>

<template>
    <div
        class="w-full hide-scrollbars relative h-[4rem] border-solid border-[#D9D9E0] dark:border-[#202020] border-b-[1px] bg-lyx-lightmode-background dark:bg-lyx-background dark:shadow-[1px_0_10px_#000000]">

        <div class="absolute flex h-full w-full">
            <div class="flex items-center px-6">
                <SelectorDomainSelector></SelectorDomainSelector>
            </div>

            <div class="hidden lg:flex items-center popping text-[.9rem] dark:text-lyx-text-dark">
                Timeframe:
                {{ new Date(safeSnapshotDates.from).toLocaleDateString() }}
                to
                {{ new Date(safeSnapshotDates.to).toLocaleDateString() }}
            </div>


            <div class="grow"></div>
            <div class="flex items-center gap-6 mr-10">

                <div v-if="!selfhosted" @click="modal.open(DialogFeedback, {});"
                    class="flex gap-2 items-center cursor-pointer  outline-[1px] outline-lyx-widget-lighter p-1 px-3 rounded-md outline">
                    <i class="far fa-message"></i>
                    Feedback
                </div>

                <div @click="modal.open(DialogHelp, {});" class="cursor-pointer"> Help </div>
                <NuxtLink to="https://docs.litlyx.com" target="_blank" class="cursor-pointer">
                    Docs
                </NuxtLink>

            </div>

        </div>

    </div>
</template>