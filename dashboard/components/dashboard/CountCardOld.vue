<script lang="ts" setup>

const props = defineProps<{
    icon: string,
    title: string,
    text: string,
    sub: string,
    color: string
}>();

</script>

<template>

    <div class="bg-menu p-4 rounded-xl flex flex-col gap-2 w-full lg:w-[20rem] relative pb-2 lg:pb-4">

        <!-- <div class="absolute flex items-center justify-center right-4 top-4 cursor-pointer hover:text-blue-400">
            <i class="fal fa-info-circle text-[.9rem] lg:text-[1.4rem]"></i>
        </div> -->

        <div class="gap-4 flex flex-row items-center lg:items-start lg:gap-2 lg:flex-col">
            <div class="w-[2.5rem] h-[2.5rem] lg:w-[3.5rem] lg:h-[3.5rem] flex items-center justify-center rounded-lg"
                :style="`background: ${props.color}`">
                <i :class="icon" class="text-[1rem] lg:text-[1.5rem]"></i>
            </div>
            <div class="text-[1rem] lg:text-[1.3rem] text-text-sub/90 poppins">
                {{ title }}
            </div>
        </div>
        <div class="flex gap-2 items-center lg:items-end">
            <div class="brockmann text-text text-[2rem] lg:text-[2.8rem] grow">
                {{ text }}
            </div>
            <div class="poppins text-text-sub/90 text-[.9rem] lg:text-[1rem]"> {{ sub }} </div>
        </div>


    </div>

</template>