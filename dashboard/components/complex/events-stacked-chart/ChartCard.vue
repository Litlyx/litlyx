<script lang="ts" setup>
import type { Slice } from '~/shared/services/DateService';
import ChartSliceSelector from '../actionable-chart/ChartSliceSelector.vue';

const props = defineProps<{ modelValue: string }>();

const emit = defineEmits<{
    (event: 'update:modelValue', slice: Slice): void
}>();

</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>
                Events
            </CardTitle>
            <CardDescription>
                Events stacked bar chart.
            </CardDescription>
            <CardAction class="flex items-center h-full">
                <ChartSliceSelector :model-value="props.modelValue"
                    @update:model-value="emit('update:modelValue', $event)"></ChartSliceSelector>
            </CardAction>
        </CardHeader>
        <CardContent class="h-full">
            <slot></slot>
        </CardContent>
    </Card>
</template>