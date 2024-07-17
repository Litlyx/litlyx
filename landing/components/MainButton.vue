<script lang="ts" setup>

const props = defineProps<{
    action?: () => {},
    link?: string,
    target?: string
}>();

</script>

<template>
    <NuxtLink @click="action?.()" :to="link" :target="target || ''"
        class="poppins font-[500] px-10 py-[.3rem] bg-[#222A42] outline outline-[1px] outline-[#5680F8] rounded-xl">
        <slot></slot>
    </NuxtLink>
</template>