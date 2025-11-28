<script lang="ts" setup>

const { close } = useDialog();
const emits = defineEmits<{ (event: 'confirm'): void }>();
const props = defineProps<{ data: { address: string } }>();

</script>

<template>
    <div class="flex flex-col gap-2">
        <Label class="text-base"> Address delete </Label>

        <div class="text-base">
            Are you sure to delete the blacklisted IP address <b>{{ props.data.address }}</b>
        </div>

        <div class="flex justify-end gap-2">
            <Button variant="secondary" @click="close()"> Back </Button>
            <Button variant="destructive" @click="emits('confirm')"> Delete </Button>
        </div>
    </div>
</template>