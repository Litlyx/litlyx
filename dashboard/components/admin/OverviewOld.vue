<script lang="ts" setup>
import type { TAdminUserProjectInfo } from '~/server/api/admin/users_projects';


import { PREMIUM_PLAN, getPlanFromId } from '@data/PREMIUM'

const page = ref<number>(0);
const limit = ref<number>(10);

const sortQuery = computed(() => {
    return JSON.stringify({ created_at: 1 })
})

const { data: usersWithProjects } = await useFetch<TAdminUserProjectInfo[]>(
    () => `/api/admin/users_projects?page=${page.value}&limit=${limit.value}&sortQuery=${sortQuery.value}`,
    signHeaders()
);

</script>

<template>
    <div class="px-2 cursor-default">
        <div v-for="user of usersWithProjects" class="py-6">

            {{ user.email }}

            <div class="flex flex-wrap gap-4">
                <div class="w-[22rem] outline outline-[1px] outline-lyx-widget-lighter p-3 rounded-md"
                    v-for="project of user.projects">

                    <div class="flex gap-4 justify-center">
                        <UTooltip :text="`PRICE_ID: ${project.premium_type.toString()}`">
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
                                <div>{{ formatNumberK(project.visits) }}</div>
                            </div>
                            <div class="flex gap-2">
                                <div class="text-right"> Events:</div>
                                <div>{{ formatNumberK(project.events) }}</div>
                            </div>
                            <div class="flex gap-2">
                                <div class="text-right"> Sessions:</div>
                                <div>{{ formatNumberK(project.sessions) }}</div>
                            </div>
                        </div>
                    </div>

                    <LyxUiSeparator class="my-2" />

                    <AdminMiniChart :pid="project._id.toString()"></AdminMiniChart>

                    <LyxUiSeparator class="my-2" />


                    <div class="flex gap-6 justify-around">
                        <div class="flex gap-1">
                            <div>
                                {{ formatNumberK(project.limits[0].visits + project.limits[0].events) }}
                                / {{ formatNumberK(project.limits[0].limit) }}
                            </div>
                            <div class="text-lyx-text-dark">
                                ~ {{
                                    (100 / project.limits[0].limit * (project.limits[0].visits +
                                        project.limits[0].events)).toFixed(1)
                                }}%
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <div>
                                {{ formatNumberK(project.limits[0].ai_messages) }}
                                / {{ formatNumberK(project.limits[0].ai_limit) }}
                            </div>
                            <div class="text-lyx-text-dark">
                                ~ {{(100 / project.limits[0].ai_limit * project.limits[0].ai_messages).toFixed(1) }}%
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>

    </div>
</template>

<style scoped lang="scss"></style>