<script lang="ts" setup>
import { onMounted } from 'vue';
import DateService, { type Slice } from '@services/DateService';

const props = defineProps<{ slice: Slice }>();

const activeProject = useActiveProject();

const { safeSnapshotDates } = useSnapshot()

function transformResponse(input: { _id: string, count: number }[]) {
    const data = input.map(e => e.count);
    const labels = input.map(e => DateService.getChartLabelFromISO(e._id, navigator.language, props.slice));
    return { data, labels }
}

const body = computed(() => {
    return {
        from: safeSnapshotDates.value.from,
        to: safeSnapshotDates.value.to,
        slice: props.slice
    }
});


const sessionsData = useFetch(`/api/metrics/${activeProject.value?._id}/timeline/visits`, {
    method: 'POST', ...signHeaders({ v2: 'true' }), body, transform: transformResponse,
    lazy: true, immediate: false
});

onMounted(async () => {
    sessionsData.execute();
});


</script>

<template>
    <div>
        <div v-if="sessionsData.pending.value" class="flex justify-center py-40">
            <i class="fas fa-spinner text-[2rem] text-accent animate-[spin_1s_linear_infinite] duration-500"></i>
        </div>
        <AdvancedLineChart v-if="!sessionsData.pending.value" :data="sessionsData.data.value?.data || []"
            :labels="sessionsData.data.value?.labels || []" color="#f56523"></AdvancedLineChart>
    </div>
</template>