<script lang="ts" setup>

const props = defineProps<{
    icon: string,
    name: string
}>();

</script>


<template>
    <div class="p-6 flex flex-col items-center gap-3">
        <div class="w-[4.2rem] h-[4.2rem] lg:w-[6rem] lg:h-[6rem] bg-menu rounded-2xl flex items-center justify-center">
            <img :src="icon">
        </div>
        <div class="poppins font-semibold text-text-sub">
            {{ name }}
        </div>
    </div>
</template>
