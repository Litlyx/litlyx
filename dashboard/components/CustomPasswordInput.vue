<script lang="ts" setup>
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next';

const props = defineProps<{ modelValue: string, readonly?: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const show = ref<boolean>(false);
</script>

<template>
    <div class="flex items-center gap-2 relative">
        <Input class="pr-8" :type="show ? 'text' : 'password'" :readonly="readonly ?? false"
            :model-value="props.modelValue" @update:model-value="emit('update:modelValue', $event as string)" />
        <EyeIcon v-if="!show" @click="show = true" class="size-4 absolute right-2 cursor-pointer"></EyeIcon>
        <EyeOffIcon v-else @click="show = false" class="size-4 absolute right-2 cursor-pointer"></EyeOffIcon>
    </div>
</template>
