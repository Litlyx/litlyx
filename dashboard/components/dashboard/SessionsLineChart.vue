<script lang="ts" setup>
import { onMounted } from 'vue';

import DateService, { type Slice } from '@services/DateService';

const data = ref<number[]>([]);
const labels = ref<string[]>([]);
const ready = ref<boolean>(false);

const props = defineProps<{ slice: Slice }>();

const { snapshot } = useSnapshot();

const snapshotFrom = computed(() => {
    return new Date(snapshot.value?.from || '0').toISOString();
});

const snapshotTo = computed(() => {
    return new Date(snapshot.value?.to || Date.now()).toISOString();
});

async function loadData() {
    ready.value = false;
    const response = await useTimeline('sessions', props.slice,
        snapshotFrom.value.toString(),
        snapshotTo.value.toString()
    );
    if (!response) return;
    data.value = response.map(e => e.count);
    labels.value = response.map(e => DateService.getChartLabelFromISO(e._id, navigator.language, props.slice));
    ready.value = true;
}

onMounted(async () => {
    await loadData();
    watch(props, async () => { await loadData(); });
    watch(snapshot, async () => { await loadData(); });
})

</script>

<template>
    <div>
        <AdvancedLineChart v-if="ready" :data="data" :labels="labels" color="#f56523"></AdvancedLineChart>
    </div>
</template>