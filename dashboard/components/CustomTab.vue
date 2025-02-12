<script lang="ts" setup>

export type CItem = { label: string, slot: string }
const props = defineProps<{ items: CItem[], manualScroll?:boolean }>();

const activeTabIndex = ref<number>(0);

</script>

<template>
    <div class="h-full flex flex-col">
        <div class="flex overflow-x-auto hide-scrollbars">
            <div class="flex">
                <div v-for="(tab, index) of items" @click="activeTabIndex = index"
                    class="px-6 pb-3 poppins font-medium text-lyx-lightmode-text dark:text-lyx-text-darker border-b-[1px] border-lyx-text-darker"
                    :class="{
                        '!border-[#88A7FF] !text-[#88A7FF]': activeTabIndex === index,
                        'hover:border-lyx-lightmode-text-dark hover:text-lyx-lightmode-text-dark/60 dark:hover:border-lyx-text-dark dark:hover:text-lyx-text-dark cursor-pointer': activeTabIndex !== index
                    }">
                    {{ tab.label }}
                </div>
            </div>
            <div class="border-b-[1px] border-lyx-text-darker w-full">

            </div>
        </div>
        <div :class="{'overflow-y-hidden': manualScroll }" class="overflow-y-auto h-full">
            <slot :name="props.items[activeTabIndex].slot"></slot>
        </div>
    </div>
</template>