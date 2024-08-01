<script lang="ts" setup>
import type { Slice } from '@services/DateService';
import { onMounted } from 'vue';

const datasets = ref<any[]>([]);
const labels = ref<string[]>([]);
const ready = ref<boolean>(false);
const props = defineProps<{ slice: Slice }>();

const slice = computed(() => props.slice);

const res = useEventsStackedTimeline(slice);

const { safeSnapshotDates } = useSnapshot()

onMounted(async () => {

    res.execute();

    res.onResponse(resData => {

        if (!resData.value) return;

        const fixed = fixMetrics({
           data:resData.value,
           from: safeSnapshotDates.value.from,
           to: safeSnapshotDates.value.to
        }, slice.value, {
            advanced: true,
            advancedGroupKey: 'name'
        });

        const parsedDatasets: any[] = [];
        const colors = ['#5655d0', '#6bbbe3', '#a6d5cb', '#fae0b9'];

        for (let i = 0; i < fixed.allKeys.length; i++) {
            const line: any = {
                data: [],
                color: colors[i] || '#FF0000',
                label: fixed.allKeys[i]
            };
            parsedDatasets.push(line)
            fixed.data.forEach((e: { key: string, value: number }[]) => {
                const target = e.find(e => e.key == fixed.allKeys[i]);
                if (!target) return;
                line.data.push(target.value);
            });
        }

        datasets.value = parsedDatasets;
        labels.value = fixed.labels;
        ready.value = true;
    });

})


const chartVisible = computed(() => {
    if (res.pending.value) return false;
    if (!res.data.value) return false;
    return true;
})

</script>

<template>
    <div>
        <div v-if="!chartVisible" class="flex justify-center py-40">
            <i class="fas fa-spinner text-[2rem] text-accent animate-[spin_1s_linear_infinite] duration-500"></i>
        </div>
        <AdvancedStackedBarChart v-if="chartVisible" :datasets="datasets" :labels="labels">
        </AdvancedStackedBarChart>
    </div>
</template>