<script lang="ts" setup>

const emits = defineEmits<{ (event: 'confirm', data?: any): void }>();
const props = defineProps<{ data: { label: string, confirm?: string, back?: string, metadata?: any } }>();
const { close } = useDialog();

</script>

<template>
    <div class="flex flex-col gap-4">
        <div>
            {{ data.label }}
        </div>
        <div class="flex justify-end gap-2">
            <Button variant="secondary" @click="close()"> {{ data.back ?? 'Back' }}</Button>
            <Button variant="destructive" @click="emits('confirm', data.metadata)"> {{ data.confirm ?? 'Delete' }}
            </Button>
        </div>
    </div>
</template>