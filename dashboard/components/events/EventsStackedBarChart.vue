<script lang="ts" setup>
import { onMounted } from 'vue';

import DateService, { type Slice } from '@services/DateService';

const props = defineProps<{ slice: Slice }>();
const slice = computed(() => props.slice);

const activeProject = useActiveProject();
const { safeSnapshotDates } = useSnapshot()

const body = computed(() => {
    return {
        from: safeSnapshotDates.value.from,
        to: safeSnapshotDates.value.to,
        slice: slice.value,
    }
});


function transformResponse(input: { _id: string, name: string, count: number }[]) {

    const fixed = fixMetrics({
        data: input,
        from: input[0]._id,
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

    return {
        datasets: parsedDatasets,
        labels: fixed.labels
    }
}

const eventsStackedData = useFetch(`/api/metrics/${activeProject.value?._id}/timeline/events_stacked`, {
    method: 'POST', body, lazy: true, immediate: false, transform: transformResponse, ...signHeaders()
});


onMounted(async () => {
    eventsStackedData.execute();
});

</script>

<template>
    <div>
        <div v-if="eventsStackedData.pending.value" class="flex justify-center py-40">
            <i class="fas fa-spinner text-[2rem] text-accent animate-[spin_1s_linear_infinite] duration-500"></i>
        </div>
        <AdvancedStackedBarChart v-if="!eventsStackedData.pending.value"
            :datasets="eventsStackedData.data.value?.datasets || []"
            :labels="eventsStackedData.data.value?.labels || []">
        </AdvancedStackedBarChart>
    </div>
</template>