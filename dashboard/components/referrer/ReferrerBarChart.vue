<script lang="ts" setup>
import { onMounted } from 'vue';

import dayjs from 'dayjs';

const data = ref<number[]>([]);
const labels = ref<string[]>([]);
const ready = ref<boolean>(false);
const props = defineProps<{ slice: SliceName, referrer: string }>();

const activeProject = useActiveProject();

async function loadData() {

    const response = await $fetch(`/api/metrics/${activeProject.value?._id.toString()}/timeline/referrers`, {
        method: 'POST',
        ...signHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
            slice: 'hour',
            from: Date.now() - 1000 * 60 * 60 * 12,
            to: Date.now(),
            referrer: props.referrer
        })
    });

    if (!response) return;

    data.value = response.map(e => e.count);
    labels.value = response.map(e => dayjs(e._id).locale(navigator.language));
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