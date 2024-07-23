<script lang="ts" setup>


const props = defineProps<{ placeholder?: string, modelValue: string }>();

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
    <input class="bg-lyx-widget-light text-lyx-text-dark poppins rounded-md outline outline-[1px] outline-lyx-widget-lighter" type="text"
        :placeholder="props.placeholder" 
        :value="props.modelValue" 
        @input="handleChange">
</template>