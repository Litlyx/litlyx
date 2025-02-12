<script lang="ts" setup>
import type { TAdminProject } from '~/server/api/admin/projects';

const props = defineProps<{ pid: string }>();

const { data: projectInfo, refresh, pending } = useFetch<{ domains: { _id: string }[], project: TAdminProject }>(
    () => `/api/admin/project_info?pid=${props.pid}`,
    signHeaders(),
);
</script>

<template>

    <div class="mt-6 h-full flex flex-col gap-10 w-full" v-if="!pending">

        <div>
            <LyxUiButton type="secondary" @click="refresh"> Refresh </LyxUiButton>
        </div>

        <div class="flex justify-center gap-10" v-if="projectInfo">

            <AdminOverviewProjectCard :project="projectInfo.project" class="w-[30rem] shrink-0" />

            <AdminMiniChart class="max-w-[40rem]" :pid="pid"></AdminMiniChart>
        </div>

        <div v-if="projectInfo" class="flex flex-col">

            <div>Domains:</div>

            <div class="flex flex-wrap gap-8 mt-8">

                <div v-for="domain of projectInfo.domains">
                    {{ domain._id }}
                </div>

            </div>

        </div>

    </div>

    <div v-if="pending">
        Loading...
    </div>
</template>

<style scoped lang="scss"></style>