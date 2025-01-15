<script lang="ts" setup>

export type ButtonType = 'primary' | 'secondary' | 'outline' | 'outlined' | 'danger';

const props = defineProps<{ type: ButtonType, link?: string, target?: string, disabled?: boolean }>();

</script>

<template>
    <NuxtLink tag="div" :to="disabled ? '' : link" :target="target"
        class="poppins w-fit cursor-pointer px-4 py-1 rounded-md outline outline-[1px] text-lyx-lightmode-text dark:text-lyx-text"
        :class="{

            'bg-[#85a3ff] hover:bg-[#9db5fc] outline-lyx-lightmode-widget-light dark:bg-lyx-primary-dark dark:outline-lyx-primary dark:hover:bg-lyx-primary-hover': type === 'primary',

            'bg-lyx-lightmode-widget-light outline-lyx-lightmode-widget dark:bg-lyx-widget-lighter hover:bg-lyx-lightmode-widget dark:outline-lyx-widget-lighter dark:hover:bg-lyx-widget-light': type === 'secondary',

            'bg-lyx-transparent outline-lyx-lightmode-widget hover:bg-lyx-lightmode-widget-light dark:outline-lyx-widget-lighter dark:hover:bg-lyx-widget-light': (type === 'outline' || type === 'outlined'),

            'bg-[#fcd1cb] hover:bg-[#f8c5be] dark:bg-lyx-danger-dark outline-lyx-danger dark:hover:bg-lyx-danger': type === 'danger',

            'text-lyx-text !bg-lyx-widget !outline-lyx-widget-lighter !cursor-not-allowed': disabled === true,
        }">
        <slot></slot>
    </NuxtLink>
</template>