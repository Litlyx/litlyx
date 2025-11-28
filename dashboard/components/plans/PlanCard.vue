<script lang="ts" setup>

import { DialogCancelPlan } from '#components';
import { CheckIcon, InfoIcon, Star,Flame } from 'lucide-vue-next';
import type { PLAN_TAG } from '~/shared/data/PLANS';

export type PlanCardPropData = {
    title: string,
    description: string,
    price_month: string,
    price_year: string,
    features: string[],
    previousText?: string,
    plan_tag: [PLAN_TAG, PLAN_TAG],
    holo: 'current_plan' | 'normal_plan',
    button: 'upgrade' | 'over_limits' | 'current' | 'custom',
    info?: { index: number, value: string }[],
    most_buy?: boolean
}

const premiumStore = usePremiumStore();

const emits = defineEmits<{ (event: 'yearly-change', value: boolean): void }>();
const props = defineProps<{ yearly: boolean, data: PlanCardPropData }>();

function changeYearly(value: boolean) {
    emits('yearly-change', value);
}

const router = useRouter();

async function onUpgradeClick() {

    const plan_tag = props.yearly ? props.data.plan_tag[1] : props.data.plan_tag[0];

    await useCatch({
        toast: true,
        toastTitle: 'Error changing plan',
        async action() {
            const result = await useAuthFetchSync<{ ok: true, soft: boolean, url?: string }>(`/api/payments/change_plan?plan=${plan_tag}`);
            return result;
        },
        onSuccess(data, showToast) {
            if (!data.url) return showToast('Success', { description: 'Plan changed successfully' });
            if (data.soft) {
                router.push(data.url);
            } else {
                window.location.href = data.url;
            }
            premiumStore.fetchPremium();
        },
    })
}


const dialog = useDialog();

async function onCancelPlanClick() {
    dialog.open({
        body: DialogCancelPlan,
        async onSuccess(_, close) {
            await cancelPlan();
            close();
        },
    })
}

async function cancelPlan() {
    await useCatch({
        toast: true,
        toastTitle: 'Error cancelling plan',
        async action() {
            const result = await useAuthFetchSync<{ ok: true, soft: boolean, url?: string }>(`/api/payments/cancel_plan`);
            return result;
        },
        onSuccess(data, showToast) {
            showToast('Success', { description: 'Plan cancelled successfully' });
            setTimeout(() => {
                location.reload();
            }, 1000)
        },
    })
}

</script>

<template>
    <Card class="relative overflow-hidden"
        :class="{ 'shadow-lg shadow-violet-500/50 !border-violet-500 dark:shadow-violet-500/10 border-2 dark:!border-violet-500/10': data.holo === 'current_plan' }">
        <div :class="{
            'from-border to-40%': data.holo === 'normal_plan',
            '!from-violet-500/50 to-60%': data.holo === 'current_plan',
            'from-violet-500/20 to-60%': data.most_buy && data.holo !== 'current_plan'
        }" class="absolute top-0 left-0 w-full h-full dark:bg-radial-[at_0%_0%] to-background">
        </div>
        <CardContent class="poppins relative z-[2] px-10 py-2 flex flex-col h-full">
            <div class="flex justify-between">
                <div class="font-medium">
                    {{ data.title }}
                </div>
                <Badge v-if="data.title==='Mini' && data.holo !== 'current_plan' && premiumStore.planInfo?.TAG==='FREE_TRIAL_LITLYX_PRO'" variant="outline" class="bg-violet-500 dark:bg-violet-500/10 text-white">
                    <Flame class="size-4 dark:text-violet-500" />Current Trial
                </Badge>
                <Badge v-if="data.holo === 'current_plan'" variant="outline" class="bg-violet-500 dark:bg-violet-500/10 text-white">
                    <Flame class="size-4 dark:text-violet-500" />Current
                </Badge>
                <Badge v-if="data.most_buy && data.holo !== 'current_plan'" variant="outline">
                    <Star class="size-4 text-yellow-500" />Popular
                </Badge>
            </div>
            <div v-if="data.button === 'custom'" class="text-2xl font-medium">
                Custom
            </div>
            <div v-else class="text-2xl font-medium"> €{{ yearly ? data.price_year : data.price_month }} </div>
            <div class="text-md text-muted-foreground">
                {{ data.description }},
                <span v-if="data.button != 'custom'">
                    billed {{ yearly ? 'yearly.' : 'monthly.' }}
                </span>
            </div>
            <div class="mt-6 poppins text-sm font-medium"> {{ data.previousText ?? '' }} </div>
            <div class="mt-2 flex flex-col gap-[.25rem]">
                <div v-for="(feature, index) of data.features" class="flex items-center gap-2">
                    <CheckIcon class="size-4"></CheckIcon>
                    <div> {{ feature }} </div>


                    <TooltipProvider v-if="data.info?.find(e => e.index === index)">
                        <Tooltip>
                            <TooltipTrigger>
                                <InfoIcon class="size-4"></InfoIcon>
                            </TooltipTrigger>
                            <TooltipContent class="w-[30rem] text-center">
                                <p class="poppins">
                                    {{data.info?.find(e => e.index === index)?.value ?? ''}}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>


                </div>
            </div>
            <div class="mt-6 flex grow items-end">

                <div v-if="data.button === 'current'" class="flex gap-2 flex-col items-center w-full">

                    <div class="flex items-center">
                        <Button :disabled="premiumStore.isCanceled" @click="onCancelPlanClick()" variant="link">
                            {{ premiumStore.isCanceled ? 'Plan canceled' : 'Cancel plan' }}
                        </Button>
                        <div v-if="premiumStore.isCanceled" class="mt-1">
                            <Tooltip>
                                <TooltipTrigger>
                                    <InfoIcon class="size-4"></InfoIcon>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Your plan will be active until {{ new Date(premiumStore.plan?.end_at ??
                                    0).toLocaleDateString() }}. We will restrict the access after it ends.
                                </TooltipContent>
                            </Tooltip>

                        </div>
                    </div>


                </div>

                <Button @click="onUpgradeClick()" v-if="data.button === 'upgrade'" variant="default"
                    class="w-full !text-white !bg-[#7537F3]">
                    Upgrade
                </Button>

                <Button v-if="data.button === 'custom'" variant="secondary" class="w-full">
                    Contact us
                </Button>

                <TooltipProvider v-if="data.button === 'over_limits'">
                    <Tooltip>
                        <TooltipTrigger class="w-full">
                            <Button variant="secondary" disabled class="w-full">
                                Over limits
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p class="poppins">
                                You currently have more pageviews than this plan allows for
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </CardContent>
    </Card>
</template>