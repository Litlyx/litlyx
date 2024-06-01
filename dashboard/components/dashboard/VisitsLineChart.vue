<script lang="ts" setup>
import { onMounted } from 'vue';

const data = ref<number[]>([]);
const labels = ref<string[]>([]);
const ready = ref<boolean>(false);

const props = defineProps<{ slice: SliceName }>();

async function loadData() {
    const response = await useTimelineDataRaw('visits', props.slice);
    if (!response) return;
    const fixed = fixMetrics(response, props.slice);
    console.log(fixed);
    data.value = fixed.data;
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
        <AdvancedLineChart v-if="ready" :data="data" :labels="labels" color="#5655d7"></AdvancedLineChart>
    </div>
</template>