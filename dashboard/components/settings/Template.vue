<script lang="ts" setup>

export type SettingsTemplateEntry = {
    title: string,
    text: string,
    id: string
}

type SettingsTemplateProp = {
    entries: SettingsTemplateEntry[]
}

const props = defineProps<SettingsTemplateProp>();

</script>


<template>
    <div class="mt-10 px-4 xl:pb-0 pb-[10rem]">
        <div v-for="(entry, index) of props.entries" class="flex flex-col">
            <div class="flex xl:flex-row flex-col gap-4 xl:gap-0">
                <div class="xl:flex-[2]">
                    <div class="poppins font-medium text-lyx-text">
                        {{ entry.title }}
                    </div>
                    <div class="poppins font-regular text-lyx-text-dark whitespace-pre-wrap">
                        {{ entry.text }}
                    </div>
                </div>
                <div class="xl:flex-[3]">
                    <slot :name="entry.id"></slot>
                </div>
            </div>
            <div v-if="index < props.entries.length - 1" class="h-[2px] bg-lyx-widget-lighter w-full my-10"></div>
        </div>
    </div>
</template>
