<script lang="ts" setup>
import type { TAdminUserInfo } from '~/server/api/admin/user_info';


const props = defineProps<{ user_id: string }>();

const { data: userInfo, refresh, pending } = useFetch<{ projects: TAdminUserInfo }>(
    () => `/api/admin/user_info?user_id=${props.user_id}`,
    signHeaders(),
);
</script>

<template>

    <div class="mt-6 h-full flex flex-col gap-10 w-full overflow-y-auto pb-[10rem]" v-if="!pending">

        <div>
            <LyxUiButton type="secondary" @click="refresh"> Refresh </LyxUiButton>
        </div>

        <div class="flex justify-center gap-10 flex-wrap" v-if="userInfo">

            <AdminOverviewProjectCard v-for="project of userInfo.projects" :project="project as any"
                class="w-[30rem] shrink-0" />

        </div>

    </div>

    <div v-if="pending">
        Loading...
    </div>
</template>

<style scoped lang="scss"></style>