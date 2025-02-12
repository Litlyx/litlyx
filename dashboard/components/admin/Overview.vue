<script lang="ts" setup>
import type { TAdminProject } from '~/server/api/admin/projects';

import { PREMIUM_PLAN, getPlanFromId } from '@data/PREMIUM'
import { useSelectMenuStyle } from '~/composables/ui/useSelectMenuStyle';

const page = ref<number>(0);
const limit = ref<number>(20);

const ordersList = [
    { label: 'created_at -->', id: '{ "created_at": 1 }' },
    { label: 'created_at <--', id: '{ "created_at": -1 }' },

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


const { data: projects, pending: pendingProjects } = await useFetch<TAdminProject[]>(
    () => `/api/admin/projects?page=${page.value}&limit=${limit.value}&sortQuery=${order.value}`,
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

            <!-- TODO: Move to metrics tab -->
            <!-- TODO: Add project details button -->
            <!-- TODO: Add project utilities -->
            <div class="flex gap-2 items-center">
                <div> Projects: </div>
                <div> 123 </div>
                <div> Premium: </div>
                <div> 123 </div>
                <div> Active: </div>
                <div> 123 </div>
                <div> Dead: </div>
                <div> 123 </div>
            </div>

            <div class="flex gap-2 items-center">
                <div> Users: </div>
                <div> 123 </div>
            </div>

            <div class="flex gap-2 items-center">
                <div> Total Visits: </div>
                <div> 123 </div>
                <div> Total Events: </div>
                <div> 123 </div>
            </div>

        </div>



        <div
            class="cursor-default flex justify-center flex-wrap gap-6 mb-[4rem] mt-4 overflow-auto h-full pt-6 pb-[8rem]">

            <AdminOverviewProjectCard v-if="!pendingProjects" :key="project._id.toString()" :project="project"
                class="w-[26rem]" v-for="project of projects" />

            <div v-if="pendingProjects"> Loading...</div>

        </div>
    </div>
</template>

<style scoped lang="scss"></style>