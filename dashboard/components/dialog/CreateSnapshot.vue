<script lang="ts" setup>

import type { DateRange } from 'reka-ui'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { CalendarIcon } from 'lucide-vue-next'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'


const emits = defineEmits<{
    (event: 'confirm', data: { name: string, color: string, from: string, to: string }): void
}>();
const { close } = useDialog();

const currentColor = ref<string>("#5680F8");

const colorpicker = useTemplateRef<HTMLInputElement>('colorpicker');

const snapshotName = ref<string>("");

function showColorPicker() {
    colorpicker.value?.click();
}

function onColorChange() {
    currentColor.value = colorpicker.value?.value || '#000000';
}

const value = ref<DateRange>({
    start: new CalendarDate(new Date().getFullYear(), new Date().getUTCMonth(), 1),
    end: new CalendarDate(new Date().getFullYear(), new Date().getUTCMonth(), new Date().getDate())
}) as Ref<DateRange>;

const canCreate = computed(() => {
    return snapshotName.value.trim().length > 2 && snapshotName.value.trim().length < 22 && value.value.start && value.value.end
})

const df = new DateFormatter('en-US', { dateStyle: 'medium' })

const popoverOpen = ref<boolean>(false);

</script>

<template>
    <div class="flex flex-col gap-4">

        <div class="relative flex items-center gap-2">
            <div @click="showColorPicker" :style="`background-color:${currentColor};`"
                class="absolute left-2 shrink-0 size-4 rounded-full">
                <input @input="onColorChange" ref="colorpicker" class="relative w-0 h-0 z-[-100]" type="color">
            </div>
            <Input v-model="snapshotName" class="pl-7" placeholder="Timeframe name"></Input>
        </div>

        <Popover v-model:open="popoverOpen">
            <PopoverTrigger as-child>
                <Button variant="outline">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    <template v-if="value.start">
                        <template v-if="value.end">
                            {{ df.format(value.start.toDate(getLocalTimeZone())) }} - {{
                                df.format(value.end.toDate(getLocalTimeZone())) }}
                        </template>

                        <template v-else>
                            {{ df.format(value.start.toDate(getLocalTimeZone())) }}
                        </template>
                    </template>
                    <template v-else>
                        Pick a date
                    </template>
                </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-4 flex flex-col items-end relative z-[90]">
                <RangeCalendar v-model="value" initial-focus :number-of-months="2"
                    @update:start-value="(startDate) => value.start = startDate" />
                <Button @click="popoverOpen = false;"> Confirm </Button>
            </PopoverContent>
        </Popover>

        <div class="flex justify-end gap-2">
            <Button variant="secondary" @click="close()"> Back </Button>
            <Button :disabled="!canCreate"
                @click="(value.start && value.end) ? emits('confirm', { name: snapshotName, color: currentColor, from: value.start.toString(), to: value.end.toString() }) : null">
                Create
            </Button>
        </div>
    </div>
</template>