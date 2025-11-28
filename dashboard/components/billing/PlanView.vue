<script lang="ts" setup>
import { LoaderCircle, TriangleAlert } from 'lucide-vue-next';
import type { TUserPlanInfo } from '~/server/api/user/plan';
import { getPlanFromId, PREMIUM_PLAN, type PLAN_TAG } from '@data/PLANS';

const { data: planInfo, status: planInfoStatus } = useAuthFetch<TUserPlanInfo>('/api/user/plan', {
    key: 'current_plan'
});

const premiumStore = usePremiumStore();

function getPrice(type: number) {
    const plan = getPlanFromId(type);
    if (!plan) return 'ERROR';
    return (plan.COST / 100).toFixed(2).replace('.', ',');
}

const billingPeriodPercent = computed(() => {
    if (!planInfo.value) return 0;
    const start = planInfo.value.start_at;
    const end = planInfo.value.end_at;
    const duration = end - start;
    const remaining = end - Date.now();
    const percent = 100 - Math.floor(100 / duration * remaining);
    return percent;
});

const billingDaysRemaining = computed(() => {
    if (!planInfo.value) return 0;
    const end = planInfo.value.end_at;
    const remaining = end - Date.now();
    return Math.floor(remaining / (1000 * 60 * 60 * 24))
})

</script>

<template>

    <div class="flex justify-center">

        <Card class="w-full">
            <CardContent>

                <div v-if="planInfo && planInfoStatus === 'success'" class="flex flex-col gap-4">

                    <div class="flex items-center gap-2">
                        <div class="font-semibold shrink-0">
                            {{ planInfo.premium ? 'Premium' : 'Free' }} plan
                        </div>
                        <Badge variant="outline">
                            {{ premiumStore.planInfo?.NAME ?? '???' }}
                        </Badge>

                        <Tooltip v-if="planInfo.payment_failed">
                            <TooltipTrigger as-child>
                                <TriangleAlert class="size-5 text-red-400">
                                </TriangleAlert>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="center">
                                Please update your billing details to avoid service interruption.
                            </TooltipContent>
                        </Tooltip>


                        <div class="grow"></div>
                        <div v-if="!isSelfhosted()" class="shrink-0">
                            <span class="text-[1.3rem] font-semibold">€ {{ getPrice(planInfo.premium_type) }}</span>
                            <span class="text-muted-foreground text-[1.1rem]">
                                {{ premiumStore.isAnnual ? ' per year' : ' per month' }}
                            </span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <div>
                            Billing period:
                        </div>
                        <div class="flex gap-8 items-center">
                            <Progress class="mt-[1px]" :model-value="billingPeriodPercent"> </Progress>
                            <div class="shrink-0 font-medium">
                                {{ billingDaysRemaining }} days left
                            </div>
                        </div>
                    </div>

                    <Separator></Separator>

                    <div class="flex items-center justify-between">
                        <div class="text-muted-foreground">
                            Expire date: {{ new Date(planInfo.end_at).toLocaleDateString() }}
                        </div>

                        <div>
                            <NuxtLink :to="isSelfhosted() ? 'https://litlyx.com/pricing-selfhosted': '/plans'">
                                <Button> Upgrade plan </Button>
                            </NuxtLink>
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