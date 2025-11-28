<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import DateService, { type Slice } from '~/shared/services/DateService';

const slices: Slice[] = ['hour', 'day', 'month'];

const props = defineProps<{ modelValue: string }>();

const emit = defineEmits<{
    (event: 'update:modelValue', slice: Slice): void
}>();

const snapshotStore = useSnapshotStore();

const availabilityMap = DateService.sliceAvailabilityMap;

const allowedSlices = computed(() => {
    const days = snapshotStore.duration;
    return slices.filter(e => days > availabilityMap[e][0] && days < availabilityMap[e][1]);
});



</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger class="group cursor-pointer">
            <div class="flex gap-1 items-center w-fit">
                <div class="group-data-[state=open]:opacity-80"> {{ modelValue }} </div>
                  <ChevronDown
      class="w-5 mt-[1px] transition-transform duration-400 group-data-[state=open]:rotate-180"
    />
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-[10rem] rounded-lg" align="start"
            side="bottom" :side-offset="16">
            <DropdownMenuLabel class="text-xs text-gray-500 dark:text-gray-400">
                Slice
            </DropdownMenuLabel>
            <DropdownMenuItem v-for="item in allowedSlices" :key="item"
                :class="{ 'text-accent-foreground': modelValue === item }" class="gap-2 p-2"
                @click="emit('update:modelValue', item)">
                {{ item }}
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
