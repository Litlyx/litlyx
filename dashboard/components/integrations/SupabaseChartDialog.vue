<script lang="ts" setup>

import { sub, isSameDay, type Duration } from 'date-fns'

type ChartType = 'bar' | 'line';
const chartTypeOptions: { value: ChartType, label: string }[] = [
    { value: 'bar', label: 'Bar chart' },
    { value: 'line', label: 'Line chart' },
]

type yAxisMode = 'count';
const yAxisModeOptions: { value: yAxisMode, label: string }[] = [
    { value: 'count', label: 'Count fields' },
]

type Slice = 'day' | 'month';
const sliceOptions: Slice[] = ['day', 'month'];

const chartType = ref<ChartType>('line');
const tableName = ref<string>('');
const xAxis = ref<string>('');
const yAxisMode = ref<yAxisMode>('count');
const slice = ref<Slice>('day');
const visualizationName = ref<string>('');


const ranges = [
    { label: 'Last 7 days', duration: { days: 7 } },
    { label: 'Last 14 days', duration: { days: 14 } },
    { label: 'Last 30 days', duration: { days: 30 } },
    { label: 'Last 3 months', duration: { months: 3 } },
    { label: 'Last 6 months', duration: { months: 6 } },
    { label: 'Last year', duration: { years: 1 } }
]
const timeframe = ref<{ start: Date, end: Date }>({ start: sub(new Date(), { days: 14 }), end: new Date() })

function isRangeSelected(duration: Duration) {
    return isSameDay(timeframe.value.start, sub(new Date(), duration)) && isSameDay(timeframe.value.end, new Date())
}

function selectRange(duration: Duration) {
    timeframe.value = { start: sub(new Date(), duration), end: new Date() }
}

const { createAlert } = useAlert();
const { closeDialog } = useCustomDialog();
const activeProjectId = useActiveProjectId();

const { integrationsCredentials,testConnection } = useSupabase();

async function generate() {
    const credentials = integrationsCredentials.data.value;
    if (!credentials?.supabase) return createAlert('Credentials not found', 'Please add supabase credentials on the integration page', 'far fa-error', 5000);
    const connectionStatus = await testConnection();
    if (!connectionStatus) return createAlert('Invalid supabase credentials', 'Please check your supabase credentials on the integration page', 'far fa-error', 5000);

    try {
        const creation = await $fetch('/api/integrations/supabase/add', {
            ...signHeaders({
                'x-pid': activeProjectId.data.value || '',
                'Content-Type': 'application/json'
            }),
            method: 'POST',
            body: JSON.stringify({
                name: visualizationName.value,
                chart_type: chartType.value,
                table_name: tableName.value,
                xField: xAxis.value,
                yMode: yAxisMode.value,
                from: timeframe.value.start,
                to: timeframe.value.end,
                slice: slice.value
            })
        })

        createAlert('Integration generated', 'Integration generated successfully', 'far fa-check-circle', 5000);
        closeDialog();
    } catch (ex: any) {
        createAlert('Error generating integrations', ex.response._data.message.toString(), 'far fa-error', 5000);
    }

}

</script>

<template>
    <div class="flex flex-col gap-4">
        <div>
            <div> Visualization name </div>
            <div>
                <LyxUiInput class="w-full px-2 py-1" v-model="visualizationName"></LyxUiInput>
            </div>
        </div>
        <div>
            <div> Chart type </div>
            <USelect v-model="chartType" :options="chartTypeOptions" />
        </div>
        <div>
            <div> Table name </div>
            <div>
                <LyxUiInput class="w-full px-2 py-1" v-model="tableName"></LyxUiInput>
            </div>
        </div>

        <div>
            <div> X axis field </div>
            <div>
                <LyxUiInput class="w-full px-2 py-1" v-model="xAxis"></LyxUiInput>
            </div>
        </div>

        <div>
            <div> Y axis mode </div>
            <div>
                <USelect v-model="yAxisMode" :options="yAxisModeOptions" />
            </div>
        </div>

        <div>
            <div> Timeframe </div>
            <div>
                <UPopover class="w-full" :popper="{ placement: 'bottom' }">
                    <UButton class="w-full" color="primary" variant="solid">
                        <div class="flex items-center justify-center w-full gap-2">
                            <i class="i-heroicons-calendar-days-20-solid"></i>
                            {{ timeframe.start.toLocaleDateString() }} - {{ timeframe.end.toLocaleDateString() }}
                        </div>
                    </UButton>
                    <template #panel="{ close }">
                        <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                            <div class="hidden sm:flex flex-col py-4">
                                <UButton v-for="(range, index) in ranges" :key="index" :label="range.label" color="gray"
                                    variant="ghost" class="rounded-none px-6"
                                    :class="[isRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
                                    truncate @click="selectRange(range.duration)" />
                            </div>

                            <DatePicker v-model="timeframe" @close="close" />
                        </div>
                    </template>
                </UPopover>
            </div>
        </div>

        <div>
            <div> View mode </div>
            <div>
                <USelect v-model="slice" :options="sliceOptions" />
            </div>
        </div>

        <LyxUiButton type="primary" @click="generate()">
            Generate
        </LyxUiButton>

    </div>
</template>