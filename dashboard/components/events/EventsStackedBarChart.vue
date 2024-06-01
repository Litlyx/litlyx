<script lang="ts" setup>
import { onMounted } from 'vue';

const datasets = ref<any[]>([]);
const labels = ref<string[]>([]);
const ready = ref<boolean>(false);

const props = defineProps<{ slice: SliceName }>();

async function loadData() {
    const response = await useTimelineDataRaw('events_stacked', props.slice);
    if (!response) return;

    const fixed = fixMetrics(response, props.slice, { advanced: true, advancedGroupKey: 'name' });

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

}

onMounted(async () => {
    await loadData();
    watch(props, async () => { await loadData(); });
})

</script>

<template>
    <div>
        <AdvancedStackedBarChart v-if="ready" :datasets="datasets" :labels="labels">
        </AdvancedStackedBarChart>
    </div>
</template>