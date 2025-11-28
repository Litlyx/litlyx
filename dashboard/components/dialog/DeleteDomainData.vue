<script lang="ts" setup>

const emits = defineEmits<{ (event: 'confirm'): void }>();
const props = defineProps<{ data: { domain: string } }>();
const { close } = useDialog();

</script>

<template>
    <div class="flex flex-col gap-4">
        <div>
            Are you sure to delete data from domain {{ props.data.domain }}?
        </div>
        <div class="flex justify-end gap-2">
            <Button variant="secondary" @click="close()"> Back </Button>
            <Button variant="destructive" @click="emits('confirm')"> Delete </Button>
        </div>
    </div>
</template>