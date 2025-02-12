<script lang="ts" setup>
import type { TAdminProject } from '~/server/api/admin/projects';

import { PREMIUM_PLAN, getPlanFromId } from '@data/PREMIUM'
import { useSelectMenuStyle } from '~/composables/ui/useSelectMenuStyle';


const page = ref<number>(1);

const ordersList = [
    { label: 'created_at -->', id: '{ "created_at": 1 }' },
    { label: 'created_at <--', id: '{ "created_at": -1 }' },

    { label: 'active -->', id: '{ "last_log_at": 1 }' },
    { label: 'active <--', id: '{ "last_log_at": -1 }' },

    { label: 'visits -->', id: '{ "visits": 1 }' },
    { label: 'visits <--', id: '{ "visits": -1 }' },

    { label: 'events -->', id: '{ "events": 1 }' },
    { label: 'events <--', id: '{ "events": -1 }' },

    { label: 'sessions -->', id: '{ "sessions": 1 }' },
    { label: 'sessions <--', id: '{ "sessions": -1 }' },

    { label: 'usage total -->', id: '{ "limit_total": 1 }' },
    { label: 'usage total <--', id: '{ "limit_total": -1 }' },

    { label: 'usage visits -->', id: '{ "limit_visits": 1 }' },
    { label: 'usage visits <--', id: '{ "limit_visits": -1 }' },

    { label: 'usage events -->', id: '{ "limit_events": 1 }' },
    { label: 'usage events <--', id: '{ "limit_events": -1 }' },

    { label: 'usage ai -->', id: '{ "limit_ai_messages": 1 }' },
    { label: 'usage ai <--', id: '{ "limit_ai_messages": -1 }' },

    { label: 'plan -->', id: '{ "premium_type": 1 }' },
    { label: 'plan <--', id: '{ "premium_type": -1 }' },

]

const order = ref<string>('{ "created_at": -1 }');

const limitList = [
    { label: '10', id: 10 },
    { label: '20', id: 20 },
    { label: '50', id: 50 },
    { label: '100', id: 100 },
]

const limit = ref<number>(20);

const filterList = [
    { label: 'ALL', id: '{}' },
    { label: 'PREMIUM', id: '{ "premium_type": { "$gt": 0, "$lt": 1000 } }' },
    { label: 'APPSUMO', id: '{ "premium_type": { "$gt": 6000, "$lt": 7000 } }' },
    { label: 'PREMIUM+APPSUMO', id: '{ "premium_type": { "$gt": 0, "$lt": 7000 } }' },
    { label: 'FREE', id: '{ "premium_type": 0' },
]

onMounted(() => {
    for (const key in PREMIUM_PLAN) {
        filterList.push({ label: key, id: `{"premium_type": ${(PREMIUM_PLAN as any)[key].ID}}` });
    }
})

const filter = ref<string>('{}');


const { data: projectsInfo, pending: pendingProjects } = await useFetch<{ count: number, projects: TAdminProject[] }>(
    () => `/api/admin/projects?page=${page.value - 1}&limit=${limit.value}&sortQuery=${order.value}&filterQuery=${filter.value}`,
    signHeaders()
);



const { uiMenu } = useSelectMenuStyle();

</script>

<template>
    <div class="mt-6 h-full">


        <div class="flex items-center gap-10 px-10">

            <div class="flex gap-2 items-center">
                <div>Order:</div>
                <USelectMenu :uiMenu="uiMenu" class="w-[12rem]" placeholder="Order" :options="ordersList"
                    value-attribute="id" option-attribute="label" v-model="order">
                </USelectMenu>
            </div>

            <div class="flex gap-2 items-center">
                <div>Limit:</div>
                <USelectMenu :uiMenu="uiMenu" class="w-[12rem]" placeholder="Limit" :options="limitList"
                    value-attribute="id" option-attribute="label" v-model="limit">
                </USelectMenu>
            </div>

            <div class="flex gap-2 items-center">
                <div>Filter:</div>
                <USelectMenu :uiMenu="uiMenu" class="w-[12rem]" placeholder="Filter" :options="filterList"
                    value-attribute="id" option-attribute="label" v-model="filter">
                </USelectMenu>
            </div>

            <div class="flex gap-2 items-center">
                <div>Page {{ page }} </div>
                <div> {{ Math.min(limit, projectsInfo?.count || 0) }} of {{ projectsInfo?.count || 0
                    }}</div>
            </div>

            <div>
                <UPagination v-model="page" :page-count="limit" :total="projectsInfo?.count || 0" />
            </div>

        </div>



        <div
            class="cursor-default flex justify-center flex-wrap gap-6 mb-[4rem] mt-4 overflow-auto h-full pt-6 pb-[8rem]">

            <AdminOverviewProjectCard v-if="!pendingProjects" :key="project._id.toString()" :project="project"
                class="w-[26rem]" v-for="project of projectsInfo?.projects" />

            <div v-if="pendingProjects"> Loading...</div>

        </div>
    </div>
</template>

<style scoped lang="scss"></style>