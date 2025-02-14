<script lang="ts" setup>

const { data: onboardings, pending: pendingOnboardings } = useFetch<any>(() => `/api/admin/onboardings`, signHeaders());

</script>

<template>
    <div class="mt-6 h-full">

        <div class="cursor-default flex flex-wrap gap-6 mb-[4rem] mt-4 overflow-auto h-full pt-6 pb-[8rem]">

            <div v-if="onboardings" class="flex gap-40 px-20">

                <div class="flex flex-col gap-4">
                    <div class="text-lyx-primary"> Anaytics </div>
                    <div class="flex items-center gap-2"
                        v-for="e of onboardings.analytics.sort((a: any, b: any) => b.count - a.count)">
                        <div>{{ e._id }}</div>
                        <div>{{ e.count }}</div>
                    </div>
                </div>

                <div class="flex flex-col gap-4">
                    <div class="text-lyx-primary"> Jobs </div>
                    <div class="flex items-center gap-2"
                        v-for="e of onboardings.jobs.sort((a: any, b: any) => b.count - a.count)">
                        <div>{{ e._id }}</div>
                        <div>{{ e.count }}</div>
                    </div>
                </div>

                <div v-if="onboardings" class="flex flex-col gap-8">
                    <AdminOnboardingPieChart :data="onboardings.analytics" title="Analytics"></AdminOnboardingPieChart>
                    <AdminOnboardingPieChart :data="onboardings.jobs" title="Jobs"></AdminOnboardingPieChart>
                </div>
            </div>


            <div v-if="pendingOnboardings"> Loading...</div>

        </div>
    </div>
</template>

<style scoped lang="scss"></style>