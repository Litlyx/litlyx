<script lang="ts" setup>

type Prop = {
    title: string,
    subtitle: string,
    chip?: string,
    active: boolean
}

const props = defineProps<Prop>();

</script>


<template>


    <div
        class="flex flex-col rounded-xl overflow-hidden hover:shadow-[0_0_50px_#2969f1] hover:outline hover:outline-[2px] hover:outline-accent cursor-pointer">
        <div class="h-[14rem] aspect-[9/7] bg-[#2f2a64] flex relative">
            <img class="object-cover" :src="'/report/card_image.png'">

            <div v-if="chip"
                class="absolute px-4 py-1 rounded-lg poppins left-2 flex gap-2 bottom-2 bg-orange-500/80 items-center">
                <div class="flex items-center"> <i class="far fa-fire text-[1.1rem]"></i></div>
                <div class="poppins text-[1rem] font-semibold"> {{ chip }} </div>
            </div>

        </div>
        <div class="bg-[#444444cc] p-4 h-[7rem] relative">
            <div class="poppins text-[1.2rem] font-bold text-text">
                {{ title }}
            </div>
            <div class="poppins text-[1rem] text-text-sub/90">
                {{ subtitle }}
            </div>
            <div class="absolute right-4 bottom-3">
                <i class="fas fa-arrow-right text-[1.2rem]"></i>
            </div>
        </div>
    </div>


</template>