<script lang="ts" setup>


const props = defineProps<{ placeholder?: string, modelValue: string, type?: string }>();

const emits = defineEmits<{
    (e: "update:modelValue", value: string): void
}>();


const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emits('update:modelValue', target.value);
};


//TODO: FUNCTIONALITY + PLACEHOLDER DARK
</script>

<template>
    <input
        class="bg-lyx-lightmode-widget-light outline-lyx-lightmode-widget text-lyx-lightmode-text dark:bg-lyx-widget-light dark:text-lyx-text-dark poppins rounded-md outline outline-[1px] dark:outline-lyx-widget-lighter"
        :type="props.type ?? 'text'" :placeholder="props.placeholder" :value="props.modelValue" @input="handleChange">
</template>