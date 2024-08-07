<script lang="ts" setup>
import { onMounted } from 'vue';
import DateService, { type Slice } from '@services/DateService';

// const data = ref<number[]>([]);
// const labels = ref<string[]>([]);
// const ready = ref<boolean>(false);

// const props = defineProps<{ slice: Slice, referrer: string }>();

// async function loadData() {
//     const response = await useReferrersTimeline(props.referrer, props.slice);
//     if (!response) return;
//     data.value = response.map(e => e.count);
//     labels.value = response.map(e => DateService.getChartLabelFromISO(e._id, navigator.language, props.slice));
//     ready.value = true;
// }

// onMounted(async () => {
//     await loadData();
//     watch(props, async () => { await loadData(); });
// })

</script>

<template>
    <div>
        <!-- <AdvancedBarChart v-if="ready" :data="data" :labels="labels" color="#5680f8">
        </AdvancedBarChart> -->
    </div>
</template>