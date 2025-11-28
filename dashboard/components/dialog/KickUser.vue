<script lang="ts" setup>

const emits = defineEmits<{ (event: 'confirm'): void }>();
const props = defineProps<{ data: { email: string } }>();
const { close } = useDialog();

</script>

<template>
    <div class="flex flex-col gap-4">
        <div>
            Are you sure to remove {{ props.data.email }}?
        </div>
        <div class="flex justify-end gap-2">
            <Button variant="secondary" @click="close()"> Undo </Button>
            <Button variant="destructive" @click="emits('confirm')"> Confirm </Button>
        </div>
    </div>
</template>