<script lang="ts" setup>
import { onMounted } from 'vue';
import DateService, { type Slice } from '@services/DateService';

const data = ref<number[]>([]);
const labels = ref<string[]>([]);
const props = defineProps<{ slice: Slice }>();

const slice = computed(() => props.slice);

const res = useTimeline('visits', slice);


onMounted(async () => {

    res.onResponse(resData => {
        if (!resData.value) return;
        data.value = resData.value.map(e => e.count);
        labels.value = resData.value.map(e => DateService.getChartLabelFromISO(e._id, navigator.language, props.slice));
    });

    await res.refresh();

    watch(props, () => res.refresh());
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
        <AdvancedLineChart v-if="chartVisible" :data="data" :labels="labels" color="#5655d7">
        </AdvancedLineChart>
    </div>
</template>