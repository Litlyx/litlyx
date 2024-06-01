<script lang="ts" setup>


type Prop = {
    title: string,
    icon: string,
    list: { text: string, icon: string }[],
    price: string,
}

const props = defineProps<Prop>();

</script>


<template>
    <div class="bg-menu py-6 rounded-lg w-full h-full flex flex-col items-center justify-normal px-6 relative">

        <div
            class="absolute rounded-full top-[-2.1rem] bg-accent w-[4.2rem] h-[4.2rem] flex items-center justify-center">
            <i :class="icon" class="text-[2.5rem]"></i>
        </div>

        <div class="poppins mt-6 font-semibold text-[1.4rem]">
            {{ title }}
        </div>

        <div class="bg-gray-400/50 h-[1px] w-full mt-6 mb-10"></div>

        <div class="flex flex-col gap-4">
            <div class="flex gap-3 items-center" v-for="element of list">

                <div class="shrink-0 flex items-center bg-accent w-[2rem] h-[2rem] justify-center rounded-full">
                    <i :class="element.icon" class="text-[.9rem]"></i>
                </div>

                <div class="poppins">
                    {{ element.text }}
                </div>
            </div>
        </div>

        <div class="bg-gray-400/50 h-[1px] w-full mt-10 mb-6"></div>

        <div class="flex gap-2 justify-between w-full">
            <div class="flex gap-2 items-end">
                <div class="manrope text-[2.5rem] font-bold text-text"> {{ price }} </div>
                <div class="poppins text-text-sub/90 mb-1">/month</div>
            </div>

            <div>
                Tasto bello
            </div>
        </div>

    </div>

</template>