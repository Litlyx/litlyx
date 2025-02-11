<script lang="ts" setup>

const { createAlert } = useAlert();
const { close } = useModal()

function copyEmail() {
    if (!navigator.clipboard) alert('You can\'t copy in HTTP');
    navigator.clipboard.writeText('help@litlyx.com');
    createAlert('Success', 'Email copied successfully.', 'far fa-circle-check', 5000);
}

</script>

<template>
    <UModal :ui="{
        strategy: 'override',
        overlay: {
            background: 'bg-lyx-background/85'
        },
        background: 'dark:bg-lyx-widget bg-lyx-lightmode-widget-light',
        ring: 'border-solid border-[1px] border-[#262626]'
    }">
        <div class="h-full flex flex-col gap-2 p-4">

            <div class="flex flex-col gap-3">

                <div class="font-medium">
                    Contact Support
                </div>

                <div class="dark:text-lyx-text-dark">
                    Contact Support for any questions or issues you have.
                </div>

                <div class="dark:bg-lyx-widget-lighter bg-lyx-lightmode-widget h-[1px]"></div>

                <div class="flex items-center justify-between gap-4">
                    <div class="p-2 bg-lyx-lightmode-widget dark:bg-[#1c1b1b] rounded-md w-full">
                        <div class="w-full text-[.9rem] dark:text-[#acacac]"> help@litlyx.com </div>
                    </div>
                    <LyxUiButton type="secondary" @click="copyEmail()"> Copy </LyxUiButton>
                    <LyxUiButton type="secondary" to="mailto:help@litlyx.com"> Send </LyxUiButton>
                </div>

                <div class="dark:text-lyx-text-dark mt-2">
                    or text us on Discord, we will reply to you personally.
                </div>

                <LyxUiButton to="https://discord.gg/9cQykjsmWX" target="_blank" type="secondary">
                    Discord Support
                </LyxUiButton>

            </div>

        </div>
    </UModal>

</template>