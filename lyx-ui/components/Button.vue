<script lang="ts" setup>

export type ButtonType = 'primary' | 'secondary' | 'outline' | 'outlined' | 'danger';

const props = defineProps<{ type: ButtonType, link?: string, target?: string, disabled?: boolean }>();

</script>

<template>
    <NuxtLink tag="div" :to="disabled ? '' : link" :target="target"
        class="poppins w-fit cursor-pointer px-4 py-1 rounded-md outline outline-[1px] text-text" :class="{
            'bg-lyx-primary-dark outline-lyx-primary hover:bg-lyx-primary-hover': type === 'primary',
            'bg-lyx-widget-lighter outline-lyx-widget-lighter hover:bg-lyx-widget-light': type === 'secondary',
            'bg-lyx-transparent outline-lyx-widget-lighter hover:bg-lyx-widget-light': (type === 'outline' || type === 'outlined'),
            'bg-lyx-danger-dark outline-lyx-danger hover:bg-lyx-danger': type === 'danger',
            '!bg-lyx-widget !outline-lyx-widget-lighter !cursor-not-allowed': disabled === true,
        }">
        <slot></slot>
    </NuxtLink>
</template>