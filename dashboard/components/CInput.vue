<script lang="ts" setup>

const props = defineProps<{ modelValue: string, placeholder?: string, readonly?: boolean }>();
const emits = defineEmits(['update:modelValue', 'change']);

function updateText(e: any) {
    emits('update:modelValue', e.target.value);
}

function emitChange(e: any) {
    emits('change', e.target.value);
}

</script>

<template>

    <div>
        <input @change="emitChange" :readonly="readonly" :value="modelValue" @input="updateText"
            class="placeholder:text-text-sub/70 w-full read-only:bg-white/10 read-only:text-text-sub/60 placeholder:text-text-sub border-gray-400 bg-bg border-[1px] text-text rounded-md px-4 py-2"
            :placeholder="placeholder" type="text">
    </div>

</template>


<style lang="scss" scoped>
input:focus {
    outline: none;
}
</style>