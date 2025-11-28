<script lang="ts" setup>
import { LoaderCircle } from 'lucide-vue-next';


const emits = defineEmits<{ (event: 'confirm'): void }>();
const { close } = useDialog();

const loading = ref<boolean>(false);

function onConfirm() {
    loading.value = true;
    emits('confirm')
}

</script>

<template>
    <div v-if="!loading" class="flex flex-col gap-4">
        <div>
            Are you sure to delete your account?
        </div>
        <div class="flex justify-end gap-2">
            <Button variant="secondary" @click="close()"> Back </Button>
            <Button variant="destructive" @click="onConfirm()"> Delete </Button>
        </div>
    </div>
    <div v-if="loading" class="flex items-center justify-center my-4">
        <LoaderCircle class="size-10 animate-[spin_1s_ease-in-out_infinite] duration-500">
        </LoaderCircle>
    </div>
</template>