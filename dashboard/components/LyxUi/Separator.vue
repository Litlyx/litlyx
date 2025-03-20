<script lang="ts" setup>



const props = defineProps<{ size?: string }>();

const widgetStyle = computed(() => {
    return `height: ${props.size ?? '1px'}`;
})

</script>

<template>
    <div :style="widgetStyle" class="dark:bg-lyx-widget-light bg-lyx-lightmode-widget"></div>
</template>