<script lang="ts" setup>

type CItem = { label: string, slot: string }
const props = defineProps<{ items: CItem[] }>();

const activeTabIndex = ref<number>(0);

</script>

<template>
    <div>
        <div class="flex">
            <div v-for="(tab, index) of items" @click="activeTabIndex = index"
                class="px-6 pb-3 poppins font-medium text-lyx-text-darker border-b-[1px] border-lyx-text-darker" :class="{
                    '!border-[#88A7FF] text-[#88A7FF]': activeTabIndex === index,
                    'hover:border-lyx-text-dark hover:text-lyx-text-dark cursor-pointer': activeTabIndex !== index
                }">
                {{ tab.label }}
            </div>
            <div class="border-b-[1px] border-lyx-text-darker w-full">

            </div>
        </div>
        <div>
            <slot :name="props.items[activeTabIndex].slot"></slot>
        </div>
    </div>
</template>