<script lang="ts" setup>


const props = defineProps<{ title: string, text: string, icon: string }>();

</script>


<template>
    <div class="bg-menu flex flex-col justify-center items-center px-8 py-10 w-[20rem] gap-4 rounded-xl">
        <div>
            <div class="bg-[#36363f] p-6 flex items-center justify-center aspect-[1/1] rounded-2xl">
                <i :class="props.icon" class="text-text text-[1.6rem]"></i>
            </div>
        </div>
        <div class="text-text text-[1.3rem] poppins font-semibold text-center mt-6">
            {{ props.title }}
        </div>
        <div class="text-text-sub/80 text-[1rem] poppins text-center">
            {{ props.text }}
        </div>
    </div>
</template>