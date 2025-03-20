<script lang="ts" setup>

const emit = defineEmits(['success', 'cancel']);

const props = defineProps<{ domain: string }>();

async function deleteDomain() {
    if (!props.domain) return;
    try {
        const res = await $fetch('/api/shields/domains/delete', {
            method: 'DELETE',
            headers: useComputedHeaders({}).value,
            body: JSON.stringify({ domain: props.domain })
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

                <div class="font-semibold text-[1.1rem]"> Domain delete </div>

                <div> Are you sure to delete the whitelisted domain
                    <span class="font-semibold">{{ props.domain }}</span>
                </div>

                <div class="flex justify-end gap-2">
                    <LyxUiButton type="secondary" @click="emit('cancel')">
                        Cancel
                    </LyxUiButton>
                    <LyxUiButton @click="deleteDomain()" type="danger">
                        Delete
                    </LyxUiButton>
                </div>
            </div>

        </div>
    </UModal>

</template>