<script lang="ts" setup>
import type { Slice } from '~/shared/services/DateService';
import ChartSliceSelector from './ChartSliceSelector.vue';
import { Table } from 'lucide-vue-next'

useHead({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }]
});

const { isShared } = useShared();

const props = defineProps<{ modelValue: string | undefined }>();

const emit = defineEmits<{
    (event: 'update:modelValue', slice: Slice): void
}>();

const exporting = ref<boolean>(false);

async function exportEvents() {
    if (exporting.value) return;
    exporting.value = true;
    const result = await useAuthFetchSync(`/api/raw/export_events`);
    const blob = new Blob([result as any], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ReportEvents.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    exporting.value = false;
}

async function exportVisits() {
    if (exporting.value) return;
    exporting.value = true;
    const result = await useAuthFetchSync(`/api/raw/export_visits`);
    const blob = new Blob([result as any], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ReportVisits.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    exporting.value = false;
}

</script>

<template>
    <Card class="gap-2">
        <CardHeader>
            <CardTitle>
                Trend chart
            </CardTitle>
            <CardDescription>
                Easily match Visits, Unique sessions and Events trends.
            </CardDescription>
            <CardAction class="flex items-center h-full gap-4 flex-col md:flex-row">

                <div v-if="!isShared" class="flex gap-4">
                    <Popover>
                        <PopoverTrigger>
                            <Button variant="ghost">
                                <Table class="size-4" /> Raw Data
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent class="flex flex-col gap-2 w-[12rem] px-4">
                            <NuxtLink to="/raw_visits"><Button variant="outline" class="w-full">Visits</Button>
                            </NuxtLink>
                            <NuxtLink to="/raw_events"><Button variant="outline" class="w-full">Events</Button>
                            </NuxtLink>

                        </PopoverContent>
                    </Popover>

                    <ChartSliceSelector v-if="props.modelValue" :model-value="props.modelValue"
                        @update:model-value="emit('update:modelValue', $event)"></ChartSliceSelector>
                </div>

            </CardAction>
        </CardHeader>
        <CardContent>
            <slot></slot>
        </CardContent>
    </Card>
</template>