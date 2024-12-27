<script lang="ts" setup>

const props = defineProps<{ icon: string }>();

</script>

<template>
    <span class="material-symbols-outlined">
        {{ props.icon }}
    </span>
</template>