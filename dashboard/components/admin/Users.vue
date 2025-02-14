<script lang="ts" setup>

import { useSelectMenuStyle } from '~/composables/ui/useSelectMenuStyle';
import type { TAdminUser } from '~/server/api/admin/users';


const filterText = ref<string>('');

watch(filterText,()=>{
    page.value = 1;
})

const filter = computed(() => {
    return JSON.stringify({
        $or: [
            { given_name: { $regex: `.*${filterText.value}.*`, $options: "i" } },
            { email: { $regex: `.*${filterText.value}.*`, $options: "i" } }
        ]
    })
})

const page = ref<number>(1);

const ordersList = [
    { label: 'created_at -->', id: '{ "created_at": 1 }' },
    { label: 'created_at <--', id: '{ "created_at": -1 }' },
]

const order = ref<string>('{ "created_at": -1 }');


const limitList = [
    { label: '10', id: 10 },
    { label: '20', id: 20 },
    { label: '50', id: 50 },
    { label: '100', id: 100 },
]

const limit = ref<number>(20);

const { data: usersInfo, pending: pendingUsers } = await useFetch<{ count: number, users: TAdminUser[] }>(
    () => `/api/admin/users?page=${page.value - 1}&limit=${limit.value}&sortQuery=${order.value}&filterQuery=${filter.value}`,
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
                <LyxUiInput placeholder="Search user" class="px-2 py-1" v-model="filterText"></LyxUiInput>
            </div>

            <div class="flex gap-2 items-center">
                <div>Page {{ page }} </div>
                <div>
                    {{ Math.min(limit, usersInfo?.count || 0) }}
                    of
                    {{ usersInfo?.count || 0 }}
                </div>
            </div>

            <div>
                <UPagination v-model="page" :page-count="limit" :total="usersInfo?.count || 0" />
            </div>

        </div>



        <div
            class="cursor-default flex justify-center flex-wrap gap-6 mb-[4rem] mt-4 overflow-auto h-full pt-6 pb-[8rem]">

            <AdminUsersUserCard v-if="!pendingUsers" :key="user._id.toString()" :user="user" class="w-[26rem]"
                v-for="user of usersInfo?.users" />

            <div v-if="pendingUsers"> Loading...</div>

        </div>
    </div>
</template>

<style scoped lang="scss"></style>