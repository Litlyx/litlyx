<script lang="ts" setup>

const props = defineProps<{ label: string, disabled?: boolean, loading?: boolean }>();

</script>


<template>
    <div :class="{ '!bg-[#354a87] !text-text/50 !cursor-not-allowed': (disabled || loading) }"
        class="bg-accent text-text px-4 py-2 text-center cursor-pointer hover:bg-[#5075e2] hover:text-text-sub">
        <span v-show="!loading">{{ label }}</span>
        <i v-if="loading" class="fas fa-loader animate-[spin_2s_linear_infinite]"></i>
    </div>
</template>