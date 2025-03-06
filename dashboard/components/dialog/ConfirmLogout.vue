<script lang="ts" setup>

const emit = defineEmits(['success', 'cancel'])

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

                <div class="font-medium">
                    Are you sure to logout ?
                </div>


                <div class="flex justify-end gap-2">
                    <LyxUiButton type="secondary" @click="emit('cancel')">
                        Cancel
                    </LyxUiButton>
                    <LyxUiButton @click="emit('success')" type="danger">
                        Confirm
                    </LyxUiButton>
                </div>
            </div>

        </div>
    </UModal>

</template>