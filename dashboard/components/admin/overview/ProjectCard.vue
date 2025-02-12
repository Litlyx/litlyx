<script lang="ts" setup>

import type { TAdminProject } from '~/server/api/admin/projects';
import { getPlanFromId } from '~/shared/data/PREMIUM';

const props = defineProps<{ project: TAdminProject }>();


const usageLabel = computed(() => {
    return formatNumberK(props.project.limit_total) + ' / ' + formatNumberK(props.project.limit_max)
});

const usagePercentLabel = computed(() => {
    const percent = 100 / props.project.limit_max * props.project.limit_total;
    return `~ ${percent.toFixed(1)}%`;
});

const usageAiLabel = computed(() => {
    return formatNumberK(props.project.limit_ai_messages) + ' / ' + formatNumberK(props.project.limit_ai_max);
}

); const usageAiPercentLabel = computed(() => {
    const percent = 100 / props.project.limit_ai_max * props.project.limit_ai_messages;
    return `~ ${percent.toFixed(1)}%`
});
</script>

<template>
    <div class="poppins outline outline-[1px] outline-lyx-widget-lighter p-3 rounded-md">

        <div class="flex gap-4 justify-center">
            <UTooltip :text="`PRICE_ID: ${project.premium_type}`">
                <div class="font-medium">
                    {{ getPlanFromId(project.premium_type)?.TAG ?? 'ERROR' }}
                </div>
            </UTooltip>
            <div class="text-lyx-text-darker">
                {{ new Date(project.created_at).toLocaleDateString('it-IT') }}
            </div>
        </div>

        <div class="flex gap-5 justify-center">
            <div class="font-medium">
                {{ project.name }}
            </div>
        </div>

        <div class="flex flex-col items-center mt-4">
            <div class="flex gap-4">
                <div class="flex gap-2">
                    <div class="text-right"> Visits:</div>
                    <div>{{ formatNumberK(project.visits || 0) }}</div>
                </div>
                <div class="flex gap-2">
                    <div class="text-right"> Events:</div>
                    <div>{{ formatNumberK(project.events || 0) }}</div>
                </div>
                <div class="flex gap-2">
                    <div class="text-right"> Sessions:</div>
                    <div>{{ formatNumberK(project.sessions || 0) }}</div>
                </div>
            </div>
        </div>

        <LyxUiSeparator class="my-2" />

        <div class="mb-2">
            <UProgress :value="project.limit_visits + project.limit_events" :max="project.limit_max"></UProgress>
        </div>

        <div class="flex gap-6 justify-around">
            <div class="flex gap-1">
                <div>
                    {{ usageLabel }}
                </div>
                <div class="text-lyx-text-dark">
                    {{ usagePercentLabel }}
                </div>
            </div>
            <div class="flex gap-2">
                <div>
                    {{ usageAiLabel }}
                </div>
                <div class="text-lyx-text-dark">
                    {{ usageAiPercentLabel }}
                </div>
            </div>

        </div>

    </div>
</template>

<style scoped lang="scss"></style>