<script lang="ts" setup>

definePageMeta({ layout: 'dashboard' });

const { data: botOptions, refresh: refreshBotOptions, pending: pendingBotOptions } = useFetch('/api/shields/bots/options', {
    headers: useComputedHeaders({})
});

async function onChange(newValue: boolean) {
    await $fetch('/api/shields/bots/update_options', {
        method: 'POST',
        headers: useComputedHeaders({ custom: { 'Content-Type': 'application/json' } }).value,
        body: JSON.stringify({ block: newValue })
    })
    await refreshBotOptions();
}

</script>

<template>

    <div class="py-4 flex">
        <LyxUiCard class="w-full mx-2">
            <div>
                <div class="text-[1.2rem] font-semibold"> Block bot traffic </div>
                <div class="dark:text-lyx-text-dark text-lyx-lightmode-text-dark">
                    Automatically block unwanted bot and crawler traffic to protect your site from spam, scrapers, and
                    unnecessary server load.
                </div>
            </div>

            <LyxUiSeparator class="my-3"></LyxUiSeparator>

            <div class="flex justify-center pb-8 text-[1.2rem]" v-if="pendingBotOptions">
                <i class="fas fa-loader animate-spin"></i>
            </div>

            <div v-if="!pendingBotOptions && botOptions">
                <div class="flex gap-2">
                    <UToggle :modelValue="botOptions.block" @change="onChange"></UToggle>
                    <div> Enable bot protection </div>
                </div>
            </div>

        </LyxUiCard>
    </div>
</template>