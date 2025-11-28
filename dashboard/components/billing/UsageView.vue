<script lang="ts" setup>
import { LoaderCircle } from 'lucide-vue-next';
import type { TUserPlanInfo } from '~/server/api/user/plan';
import { getPlanFromId, PREMIUM_PLAN, type PLAN_TAG } from '@data/PLANS';

const { data: planInfo, status: planInfoStatus } = useAuthFetch<TUserPlanInfo>('/api/user/plan', {
    key: 'current_plan'
});


const usagePercent = computed(() => {
    if (!planInfo.value) return 0;
    return 100 / planInfo.value.limit * planInfo.value.count;
})

</script>

<template>

    <div class="flex justify-center">

        <Card class="w-full">
            <CardContent>

                <div v-if="planInfo && planInfoStatus === 'success'" class="flex flex-col gap-4">

                    <div class="flex flex-col">
                        <div class="font-semibold shrink-0">
                            Usage
                        </div>
                        <div class="text-muted-foreground">
                            Check the usage limits of your project.
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <div>
                            Usage:
                        </div>
                        <div class="flex gap-8 items-center">
                            <Progress class="mt-[1px]" :model-value="Math.floor(usagePercent)"> </Progress>
                            <div class="shrink-0 font-medium">
                                {{ usagePercent.toFixed(2) }}%
                            </div>
                        </div>
                        <div class="text-center">
                            {{ formatNumberK(planInfo.count) }} / {{ formatNumberK(planInfo.limit) }}
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-center" v-else>
                    <LoaderCircle class="size-10 animate-[spin_1s_ease-in-out_infinite] duration-500">
                    </LoaderCircle>
                </div>

            </CardContent>
        </Card>

    </div>

</template>