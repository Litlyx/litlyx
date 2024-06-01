<script lang="ts" setup>
import { onMounted } from 'vue';

const data = ref<number[]>([]);
const labels = ref<string[]>([]);
const ready = ref<boolean>(false);
const key = ref<string>('0');

const props = defineProps<{ slice: SliceName }>();

async function loadData() {
    const response = await useTimelineData('sessions', props.slice);
    if (!response) return;
    data.value = response.data;
    labels.value = response.labels;
    ready.value = true;
    key.value = Date.now().toString();
}

onMounted(async () => {
    await loadData();
    watch(props, async () => { await loadData(); });
})

</script>

<template>
    <div>
        <AdvancedLineChart v-if="ready" :data="data" :labels="labels" color="#f56523"></AdvancedLineChart>
    </div>
</template>