<script lang="ts" setup>

import { DialogFeedback, DialogHelp } from '#components';

const modal = useModal();
const selfhosted = useSelfhosted();


const colorMode = useColorMode()
const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})

</script>

<template>
    <div
        class="w-full overflow-y-auto hide-scrollbars h-[4rem] border-solid border-[#D9D9E0] dark:border-[#202020] border-b-[1px] bg-lyx-lightmode-background dark:bg-lyx-background flex dark:shadow-[1px_0_10px_#000000]">

        <div class="flex items-center px-6">
            <SelectorDomainSelector></SelectorDomainSelector>
        </div>

        <div class="grow"></div>
        <div class="flex items-center gap-6 mr-10">
            <div v-if="!selfhosted" @click="modal.open(DialogFeedback, {});"
                class="flex gap-2 items-center cursor-pointer">
                <i class="far fa-message"></i>
                Feedback
            </div>
            <div @click="modal.open(DialogHelp, {});" class="cursor-pointer"> Help </div>
            <NuxtLink to="https://docs.litlyx.com" target="_blank" class="cursor-pointer">
                Docs
            </NuxtLink>


            <div>
                <UTooltip :text="isDark ? 'Toggle light mode' : 'Toggle dark mode'">
                    <i @click="isDark = !isDark"
                        class="cursor-pointer hover:text-lyx-lightmode-text text-lyx-lightmode-text-dark dark:hover:text-lyx-text dark:text-lyx-text-dark"
                        :class="isDark ? 'far fa-moon' : 'far fa-sun'"></i>
                </UTooltip>
            </div>

        </div>

    </div>
</template>