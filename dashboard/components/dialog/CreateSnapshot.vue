<script lang="ts" setup>

const { closeDialog } = useCustomDialog();

import { sub, format, isSameDay, type Duration, startOfDay, endOfDay } from 'date-fns'

const ranges = [
    { label: 'Last 7 days', duration: { days: 7 } },
    { label: 'Last 14 days', duration: { days: 14 } },
    { label: 'Last 30 days', duration: { days: 30 } },
    { label: 'Last 3 months', duration: { months: 3 } },
    { label: 'Last 6 months', duration: { months: 6 } },
    { label: 'Last year', duration: { years: 1 } }
]
const selected = ref<{ start: Date, end: Date }>({ start: sub(new Date(), { days: 14 }), end: new Date() })

function isRangeSelected(duration: Duration) {
    return isSameDay(selected.value.start, sub(new Date(), duration)) && isSameDay(selected.value.end, new Date())
}

function selectRange(duration: Duration) {
    selected.value = { start: sub(new Date(), duration), end: new Date() }
}

const currentColor = ref<string>("#5680F8");

const colorpicker = ref<HTMLInputElement | null>(null);

function showColorPicker() {
    colorpicker.value?.click();
}

function onColorChange() {
    currentColor.value = colorpicker.value?.value || '#000000';
}

const snapshotName = ref<string>("");

const { updateSnapshots, snapshot, snapshots } = useSnapshot();
const { createAlert } = useAlert()

async function confirmSnapshot() {
    await $fetch("/api/snapshot/create", {
        method: 'POST',
        headers: useComputedHeaders({ useSnapshotDates: false }).value,
        body: JSON.stringify({
            name: snapshotName.value,
            color: currentColor.value,
            from: startOfDay(selected.value.start),
            to: endOfDay(selected.value.end)
        })
    });

    await updateSnapshots();
    closeDialog();
    createAlert('Timeframe created', 'Timeframe created successfully', 'far fa-circle-check', 5000);
    const newSnapshot = snapshots.value.at(-1);
    if (newSnapshot) snapshot.value = newSnapshot;

}

</script>

<template>
    <div class="w-full h-full flex flex-col">

        <div class="poppins text-center text-lyx-lightmode-text dark:text-lyx-text">
            Create a timeframe
        </div>

        <div class="mt-10 flex items-center gap-2">
            <div :style="`background-color: ${currentColor};`" @click="showColorPicker"
                class="w-6 h-6 rounded-full aspect-[1/1] relative cursor-pointer">
                <input @input="onColorChange" ref="colorpicker" class="relative w-0 h-0 z-[-100]" type="color">
            </div>
            <div class="grow">
                <LyxUiInput placeholder="Timeframe name" v-model="snapshotName" class="px-4 py-1 w-full"></LyxUiInput>
            </div>
        </div>

        <div class="mt-4 justify-center flex w-full">
            <UPopover class="w-full" :popper="{ placement: 'bottom' }">
                <UButton class="w-full" color="primary" variant="solid">
                    <div class="flex items-center justify-center w-full gap-2">
                        <i class="i-heroicons-calendar-days-20-solid"></i>
                        {{ selected.start.toLocaleDateString() }} - {{ selected.end.toLocaleDateString() }}
                    </div>
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
        <div class="flex items-center justify-around gap-4">
            <LyxUiButton @click="closeDialog()" type="secondary" class="w-full text-center">
                Cancel
            </LyxUiButton>
            <LyxUiButton @click="confirmSnapshot()" type="primary" class="w-full text-center"
                :disabled="snapshotName.length == 0">
                Confirm
            </LyxUiButton>
        </div>

    </div>
</template>