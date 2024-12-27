<script lang="ts" setup>

const emits = defineEmits<{
    (evt: 'onCloseClick'): void
}>();

</script>

<template>
    <div class="w-full h-full">
        <iframe class="w-full h-full" src="https://docs.litlyx.com/introduction" frameborder="0"></iframe>
    </div>
</template>