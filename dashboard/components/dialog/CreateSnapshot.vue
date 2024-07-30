<script lang="ts" setup>

const { closeDialog } = useCustomDialog();

import { sub, format, isSameDay, type Duration } from 'date-fns'

const ranges = [
    { label: 'Last 7 days', duration: { days: 7 } },
    { label: 'Last 14 days', duration: { days: 14 } },
    { label: 'Last 30 days', duration: { days: 30 } },
    { label: 'Last 3 months', duration: { months: 3 } },
    { label: 'Last 6 months', duration: { months: 6 } },
    { label: 'Last year', duration: { years: 1 } }
]
const selected = ref({ start: sub(new Date(), { days: 14 }), end: new Date() })

function isRangeSelected(duration: Duration) {
    return isSameDay(selected.value.start, sub(new Date(), duration)) && isSameDay(selected.value.end, new Date())
}

function selectRange(duration: Duration) {
    selected.value = { start: sub(new Date(), duration), end: new Date() }
}

const currentColor = ref<string>("");

const colorpicker = ref<HTMLInputElement | null>(null);

function showColorPicker() {
    colorpicker.value?.click();
}

function onColorChange() {
    currentColor.value = colorpicker.value?.value || '#000000';
}

</script>

<template>
    <div class="w-full h-full flex  flex-col">

        <div class="poppins text-center">
            Create a snapshot
        </div>

        <div class="mt-10 flex items-center gap-2">
            <div :style="`background-color: ${currentColor};`" @click="showColorPicker" class="w-6 h-6 rounded-full aspect-[1/1] relative">
                <input @input="onColorChange" ref="colorpicker" class="relative w-0 h-0 z-[-100]" type="color">
            </div>
            <div class="grow">
                <input placeholder="Snapshot name" class="px-4 py-2 w-full rounded-lg bg-lyx-widget-light" type="text">
            </div>
        </div>

        <div class="mt-4 justify-center flex w-full">

            <UPopover :popper="{ placement: 'bottom' }">
                <UButton icon="i-heroicons-calendar-days-20-solid">
                    {{ selected.start.toLocaleDateString() }} - {{ selected.end.toLocaleDateString() }}
                </UButton>
                <template #panel="{ close }">
                    <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                        <div class="hidden sm:flex flex-col py-4">
                            <UButton v-for="(range, index) in ranges" :key="index" :label="range.label" color="gray"
                                variant="ghost" class="rounded-none px-6"
                                :class="[isRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
                                truncate @click="selectRange(range.duration)" />
                        </div>

                        <DatePicker v-model="selected" @close="close" />
                    </div>
                </template>
            </UPopover>


        </div>

        <div class="grow"></div>
        <div class="flex items-center justify-around">
            <div @click="closeDialog()">
                Cancel
            </div>
            <div @click="closeDialog()">
                Confirm
            </div>
        </div>

    </div>
</template>