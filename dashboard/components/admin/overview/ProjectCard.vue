<script lang="ts" setup>

import type { TAdminProject } from '~/server/api/admin/projects';
import { getPlanFromId } from '~/shared/data/PLANS';

import { AdminDialogUserDetails } from '#components';

const { openDialogEx } = useCustomDialog();

function showUserDetails(user_id: string) {
    openDialogEx(AdminDialogUserDetails, {
        params: { user_id }
    })
}

const props = defineProps<{ project: TAdminProject & { domains?: string[] } }>();


const logBg = computed(() => {

    const day = 1000 * 60 * 60 * 24;
    const week = 1000 * 60 * 60 * 24 * 7;

    const lastLoggedAtDate = new Date(props.project.last_log_at || 0);

    if (lastLoggedAtDate.getTime() > Date.now() - day) {
        return 'bg-green-500'
    } else if (lastLoggedAtDate.getTime() > Date.now() - week) {
        return 'bg-yellow-500'
    } else {
        return 'bg-red-500'
    }

});


const dateDiffDays = computed(() => {
    const res = (Date.now() - new Date(props.project.last_log_at || 0).getTime()) / (1000 * 60 * 60 * 24)
    if (res > -1 && res < 1) return 0;
    return res;
});

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
    <div class="poppins outline outline-[1px] outline-lyx-widget-lighter p-3 rounded-md relative h-fit">

        <div class="absolute top-1 left-2 text-[.8rem] text-lyx-text-dark flex items-center gap-2">
            <div :class="logBg" class="h-3 w-3 rounded-full"> </div>
            <div class="mt-1"> {{ dateDiffDays.toFixed(0) }} days </div>
        </div>

        <div class="flex gap-4 justify-center  text-[.9rem]">
            <UTooltip :text="`PRICE_ID: ${project.premium[0].premium_type}`">
                <div class="font-medium text-lyx-text-dark">
                    {{ getPlanFromId(project.premium[0].premium_type)?.TAG?.replace('APPSUMO', 'AS') ?? 'ERROR' }}
                </div>
            </UTooltip>
            <div class="text-lyx-text-darker">
                {{ new Date(project.created_at).toLocaleDateString('it-IT') }}
            </div>
        </div>

        <div class="flex flex-col items-center py-1">
            <div class="text-center"> {{ project.name }} </div>
            <div v-if="project.user" @click="showUserDetails(project.premium[0].user_id.toString())"
                class="font-medium hover:text-lyx-primary cursor-pointer text-center">
                {{ project.user[0].email }}
            </div>
        </div>

        <div class="flex flex-col items-center mt-2">
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

        <LyxUiSeparator class="my-2" />

        <div v-if="project.domains" class="flex flex-wrap gap-4">
            <div v-for="domain of project.domains" class="hover:text-gray-200 cursor-pointer">
                {{ domain }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>