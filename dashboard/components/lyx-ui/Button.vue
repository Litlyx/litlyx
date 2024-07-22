<script lang="ts" setup>

export type ButtonType = 'primary' | 'secondary' | 'outline' | 'danger';

const props = defineProps<{ type: ButtonType, }>();

</script>

<template>
    <div class="poppins w-fit cursor-pointer px-4 py-1 rounded-md outline outline-[1px] text-text" :class="{
        'bg-lyx-primary-dark outline-lyx-primary hover:bg-lyx-primary-hover': type === 'primary',
        'bg-lyx-widget-lighter outline-lyx-widget-lighter hover:bg-lyx-widget-light': type === 'secondary',
        'bg-lyx-transparent outline-lyx-widget-lighter hover:bg-lyx-widget-light': type === 'outline',
        'bg-lyx-danger-dark outline-lyx-danger hover:bg-lyx-danger': type === 'danger',
    }">
        <slot></slot>
    </div>
</template>