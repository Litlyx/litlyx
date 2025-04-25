<script lang="ts" setup>

import type { TAdminProject } from '~/server/api/admin/projects';
import type { TAdminUser } from '~/server/api/admin/users';
import { getPlanFromId } from '~/shared/data/PLANS';

import { AdminDialogProjectDetails } from '#components';

const { openDialogEx } = useCustomDialog();

function showProjectDetails(pid: string) {
    openDialogEx(AdminDialogProjectDetails, {
        params: { pid }
    })
}

const props = defineProps<{ user: TAdminUser }>();

</script>

<template>

    <div class="poppins outline outline-[1px] outline-lyx-widget-lighter p-3 rounded-md relative max-h-[15rem]">
        <div class="flex gap-4 justify-center  text-[.9rem]">
            <div class="font-medium text-lyx-text-dark">
                {{ user.name ?? user.given_name }}
            </div>
            <div class="text-lyx-text-darker">
                {{ new Date(user.created_at).toLocaleDateString('it-IT') }}
            </div>
        </div>

        <div class="flex gap-5 justify-center">
            <div class="font-medium">
                {{ user.email }}
            </div>
        </div>

        <LyxUiSeparator class="my-2" />

        <div class="flex flex-col text-[.9rem]">
            <div class="flex gap-2" v-for="project of user.projects">
                <div class="text-lyx-text-darker">
                    {{ new Date(project.created_at).toLocaleDateString('it-IT') }}
                </div>
                <UTooltip :text="`PRICE_ID: ${project.premium_type}`">
                    <div class="font-medium text-lyx-text-dark">
                        {{ getPlanFromId(project.premium_type)?.TAG?.replace('APPSUMO', 'AS') ?? 'ERROR' }}
                    </div>
                </UTooltip>

                <div @click="showProjectDetails(project._id.toString())"
                    class="ml-1 hover:text-lyx-primary cursor-pointer">
                    {{ project.name }}
                </div>

            </div>

        </div>


    </div>

    <!-- <div class="poppins outline outline-[1px] outline-lyx-widget-lighter p-3 rounded-md relative">

        <div class="absolute top-1 left-2 text-[.8rem] text-lyx-text-dark flex items-center gap-2">
            <div :class="logBg" class="h-3 w-3 rounded-full"> </div>
            <div class="mt-1"> {{ dateDiffDays.toFixed(0) }} days </div>
        </div>

        <div class="flex gap-4 justify-center  text-[.9rem]">
            <UTooltip :text="`PRICE_ID: ${project.premium_type}`">
                <div class="font-medium text-lyx-text-dark">
                    {{ getPlanFromId(project.premium_type)?.TAG?.replace('APPSUMO', 'AS') ?? 'ERROR' }}
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

    </div> -->

</template>

<style scoped lang="scss"></style>