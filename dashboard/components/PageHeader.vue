<script lang="ts" setup>
defineProps<{ title?: string, description?: string }>();
</script>

<template>
    <div class="space-y-1 poppins">
        <h1 class="text-[16px] font-semibold lg:text-lg"> {{ title }} </h1>
        <p class="text-gray-500 text-sm lg:text-md dark:text-gray-400"> {{ description }} </p>
    </div>
</template>