<script lang="ts" setup>

const emit = defineEmits(['success', 'cancel']);

const props = defineProps<{ address: string }>();

async function deleteAddress() {
    if (!props.address) return;
    try {
        const res = await $fetch('/api/shields/ip/delete', {
            method: 'DELETE',
            headers: useComputedHeaders({}).value,
            body: JSON.stringify({ address: props.address })
        });
        emit('success');
    } catch (ex: any) {
        alert(ex.message);
        emit('cancel');
    }
}

</script>

<template>
    <UModal :ui="{
        strategy: 'override',
        overlay: {
            background: 'bg-lyx-background/85'
        },
        background: 'dark:bg-lyx-widget bg-lyx-lightmode-widget-light',
        ring: 'border-solid border-[1px] border-[#262626]'
    }">
        <div class="h-full flex flex-col gap-2 p-4">

            <div class="flex flex-col gap-3">

                <div class="font-semibold text-[1.1rem]"> IP Address delete </div>

                <div> Are you sure to delete the blacklisted IP Address
                    <span class="font-semibold">{{ props.address }}</span>
                </div>

                <div class="flex justify-end gap-2">
                    <LyxUiButton type="secondary" @click="emit('cancel')">
                        Cancel
                    </LyxUiButton>
                    <LyxUiButton @click="deleteAddress()" type="danger">
                        Delete
                    </LyxUiButton>
                </div>
            </div>

        </div>
    </UModal>

</template>