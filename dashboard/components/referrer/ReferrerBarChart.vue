<script lang="ts" setup>
import { onMounted } from 'vue';

const data = ref<number[]>([]);
const labels = ref<string[]>([]);
const ready = ref<boolean>(false);
const props = defineProps<{ slice: SliceName, referrer: string }>();

const activeProject = useActiveProject();

async function loadData() {

    const response = await $fetch(`/api/metrics/${activeProject.value?._id.toString()}/timeline/referrers`, {
        method: 'POST',
        ...signHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ slice: 'day', referrer: props.referrer })
    });

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
        <AdvancedBarChart v-if="ready" :data="data" :labels="labels" color="#5680f8">
        </AdvancedBarChart>
    </div>
</template>