<script lang="ts" setup>
const { data: onboarding } = useAuthFetch('/api/admin/onboarding');

</script>

<template>
    <div class="flex flex-col gap-4 h-full overflow-y-auto">

        <div class="mt-6 h-full">

            <div class="cursor-default flex flex-wrap gap-6 mb-[4rem] mt-4 h-full pt-6 pb-[8rem]">

                <div v-if="onboarding" class="flex gap-40 px-20">

                    <div class="flex flex-col gap-4">
                        <div class="text-lyx-primary"> Anaytics </div>
                        <div class="flex items-center gap-2"
                            v-for="e of onboarding.analytics.sort((a: any, b: any) => b.count - a.count)">
                            <div>{{ e._id }}</div>
                            <div>{{ e.count }}</div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4">
                        <div class="text-lyx-primary"> Jobs </div>
                        <div class="flex items-center gap-2"
                            v-for="e of onboarding.jobs.sort((a: any, b: any) => b.count - a.count)">
                            <div>{{ e._id }}</div>
                            <div>{{ e.count }}</div>
                        </div>
                    </div>

                    <div v-if="onboarding" class="flex flex-col gap-8">
                        <AdminOnboardingPieChart :data="onboarding.analytics" title="Analytics">
                        </AdminOnboardingPieChart>
                        <AdminOnboardingPieChart :data="onboarding.jobs" title="Jobs"></AdminOnboardingPieChart>
                    </div>
                </div>

            </div>
        </div>


    </div>
</template>