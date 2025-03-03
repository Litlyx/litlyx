<script setup lang="ts">

import type { CItem } from '~/components/CustomTab.vue';

definePageMeta({ layout: 'dashboard' });


const details = ref<any>();
const showDetails = ref<boolean>(false);

const tabs: CItem[] = [
    { label: 'Overview', slot: 'overview' },
    { label: 'Users', slot: 'users' },
    { label: 'Feedbacks', slot: 'feedbacks' },
    { label: 'OnBoarding', slot: 'onboarding' },
    { label: 'Backend', slot: 'backend' }
]

</script>


<template>
    <div class="bg-bg overflow-y-hidden w-full p-6 gap-6 flex flex-col h-full">

        <CustomTab :items="tabs" :manualScroll="true">
            <template #overview>
                <AdminOverview></AdminOverview>
            </template>
            <template #users>
                <AdminUsers></AdminUsers>
            </template>
            <template #feedbacks>
                <AdminFeedbacks></AdminFeedbacks>
            </template>
            <template #onboarding>
                <AdminOnboardings></AdminOnboardings>
            </template>
            <template #backend>
                <AdminBackend></AdminBackend>
            </template>
        </CustomTab>

    </div>
</template>

<style scoped></style>