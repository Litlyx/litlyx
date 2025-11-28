<script lang="ts" setup>

import type { PlanCardPropData } from '~/components/plans/PlanCard.vue';
import { getPlanFromTag, type PLAN_TAG } from '~/shared/data/PLANS';


const { data: plan } = useAuthFetch('/api/user/plan');

function getPlanButtonType(premium_type: number): PlanCardPropData['button'][] {

    const CURRENT_PLAN = premium_type;

    if (CURRENT_PLAN === 101) return ['over_limits', 'upgrade', 'upgrade', 'upgrade', 'upgrade'];
    if (CURRENT_PLAN === 102) return ['over_limits', 'upgrade', 'upgrade', 'upgrade', 'upgrade'];
    if (CURRENT_PLAN === 103) return ['over_limits', 'over_limits', 'upgrade', 'upgrade', 'upgrade'];
    if (CURRENT_PLAN === 104) return ['over_limits', 'over_limits', 'over_limits', 'upgrade', 'upgrade'];
    if (CURRENT_PLAN === 105) return ['over_limits', 'over_limits', 'over_limits', 'over_limits', 'upgrade'];
    if (CURRENT_PLAN === 106) return ['over_limits', 'over_limits', 'over_limits', 'over_limits', 'over_limits'];

    if (CURRENT_PLAN === 2001) return ['upgrade', 'upgrade', 'upgrade', 'upgrade', 'upgrade'];
    if (CURRENT_PLAN === 5001) return ['upgrade', 'upgrade', 'upgrade', 'upgrade', 'upgrade'];

    if (CURRENT_PLAN === 6001) return ['over_limits', 'upgrade', 'upgrade', 'upgrade', 'upgrade'];
    if (CURRENT_PLAN === 6002) return ['over_limits', 'over_limits', 'upgrade', 'upgrade', 'upgrade'];
    if (CURRENT_PLAN === 6003) return ['over_limits', 'over_limits', 'over_limits', 'upgrade', 'upgrade'];
    if (CURRENT_PLAN === 6006) return ['over_limits', 'over_limits', 'over_limits', 'over_limits', 'upgrade'];

    if (CURRENT_PLAN === 7006) return ['upgrade', 'upgrade', 'upgrade', 'upgrade', 'upgrade'];
    if (CURRENT_PLAN === 7999) return ['upgrade', 'upgrade', 'upgrade', 'upgrade', 'upgrade'];


    if (CURRENT_PLAN === 8001 || CURRENT_PLAN === 8002) return ['current', 'upgrade', 'upgrade', 'upgrade', 'upgrade'];
    if (CURRENT_PLAN === 8003 || CURRENT_PLAN === 8004) return ['over_limits', 'current', 'upgrade', 'upgrade', 'upgrade'];
    if (CURRENT_PLAN === 8005 || CURRENT_PLAN === 8006) return ['over_limits', 'over_limits', 'current', 'upgrade', 'upgrade'];
    if (CURRENT_PLAN === 8007 || CURRENT_PLAN === 8008) return ['over_limits', 'over_limits', 'over_limits', 'current', 'upgrade'];
    if (CURRENT_PLAN === 8009 || CURRENT_PLAN === 8010) return ['over_limits', 'over_limits', 'over_limits', 'over_limits', 'current'];



    return ['upgrade', 'upgrade', 'upgrade', 'upgrade', 'upgrade'];

}

function getHoloType(plan_tags: PLAN_TAG[]): PlanCardPropData['holo'] {
    const ids = plan_tags.map(e => getPlanFromTag(e)?.ID);
    if (ids.includes(plan.value?.premium_type)) return 'current_plan';
    return 'normal_plan'
}

const plansArray = shallowRef<PlanCardPropData[]>([]);

watch(plan, () => {
    if (!plan.value) return;
    plansArray.value = getPlansArray(plan.value.premium_type);
})

function getPlansArray(current_premium_type: number): PlanCardPropData[] {
    return [
        {
            title: 'Mini',
            plan_tag: ['MINI_MONTHLY', 'MINI_ANNUAL'],
            price_month: '5,99',
            price_year: '4,99',
            description: 'Up to 10K pageviews per month',
            features: [
                "Up to 1 workspace",
                "No members allowed",
                "Up to 2 Years Data retention",
                "Unlimited domains per workspace",
                "Advanced Analytics",
                "Easy report"
            ],
            info: [
                { index: 4, value: 'Advanced Analytics include: time on page, entry/exit pages, UTM and campaign parameters, traffic medium, and advanced user location (country/region/city).' }
            ],
            holo: getHoloType(['MINI_MONTHLY', 'MINI_ANNUAL']),
            button: getPlanButtonType(current_premium_type)[0]
        },
        {
            title: 'Basic',
            plan_tag: ['BASIC_MONTHLY', 'BASIC_ANNUAL'],
            price_month: '17,99',
            price_year: '14,99',
            description: 'Up to 150K pageviews per month',
            previousText: 'Everything in Mini plus:',
            most_buy: true,
            features: [
                "Up to 2 workspaces",
                "No members allowed",
                "Up to 3 Years Data retention",
                "Public shareable links",
                "Unlimited AI messages"
            ],
            holo: getHoloType(['BASIC_MONTHLY', 'BASIC_ANNUAL']),
            button: getPlanButtonType(current_premium_type)[1]
        },
        {
            title: 'Pro',
            plan_tag: ['PRO_MONTHLY', 'PRO_ANNUAL'],
            price_month: '37,99',
            price_year: '29,99',
            description: 'Up to 500K pageviews per month',
            previousText: 'Everything in Basic plus:',
            features: [
                "Up to 3 workspaces",
                "No members allowed",
                "Up to 5 Years Data retention",
                "Private shareable links"
            ],
            holo: getHoloType(['PRO_MONTHLY', 'PRO_ANNUAL']),
            button: getPlanButtonType(current_premium_type)[2]
        },
        {
            title: 'Launch',
            plan_tag: ['LAUNCH_MONTHLY', 'LAUNCH_ANNUAL'],
            price_month: '67,99',
            price_year: '59,99',
            description: 'Up to 2M pageviews per month',
            most_buy: true,
            features: [
                "Up to 10 workspaces",
                "Up to 3 members per workspace",
                "Up to 6 Years Data retention",
                "Unlimited AI messages",
                "Shareable links",
                "Advanced reports"
            ],
            holo: getHoloType(['LAUNCH_MONTHLY', 'LAUNCH_ANNUAL']),
            button: getPlanButtonType(current_premium_type)[3]
        },
        {
            title: 'Scale',
            plan_tag: ['SCALE_MONTHLY', 'SCALE_ANNUAL'],
            price_month: '97,99',
            price_year: '89,99',
            description: 'Up to 5M pageviews per month',
            previousText: 'Everything in Launch plus:',
            features: [
                "Up to 25 workspaces",
                "Unlimited members per workspace",
                "Up to 10 Years Data retention",
                "Dedicated server",
                "Priority support"
            ],
            holo: getHoloType(['SCALE_MONTHLY', 'SCALE_ANNUAL']),
            button: getPlanButtonType(current_premium_type)[4]
        },
        {
            title: 'Enterprise',
            plan_tag: ['MINI_MONTHLY', 'MINI_ANNUAL'],
            price_month: '',
            price_year: '',
            description: 'Our software scale at each stage.',
            features: [
                "+5M pageviews per month",
                "+25 workspaces",
                "Custom features",
                "Dedicated server",
                "On premise support",
                "Personal success manager"
            ],
            holo: 'normal_plan',
            button: 'custom'
        }
    ]
}


const yearly = ref<boolean>(true);

</script>

<template>
    <div>
        <PageHeader title="Plans"
            description="Try Litlyx for free for 30 days. Upgrade to gain additional features, and increase pageviews limits." />

        <p class="text-gray-500 text-sm dark:text-gray-400 poppins ">
            <span>To view your plan and invoices check your billing overview
                <NuxtLink to="/billing" class="text-[#9f7be7]"> here </NuxtLink>
            </span>
        </p>

        <Tabs class="mt-8" default-value="personal" v-if="plansArray.length > 0">

            <div class="flex gap-4 items-center">
                <TabsList>
                    <TabsTrigger value="personal">
                        <div class="poppins px-2"> Personal </div>
                    </TabsTrigger>
                    <TabsTrigger value="business">
                        <div class="poppins px-2"> Business </div>
                    </TabsTrigger>
                </TabsList>
                <div class="flex items-center gap-2">
                    <Switch v-model="yearly"></Switch>
                    <Label class="text-sm text-muted-foreground">{{ yearly ? 'Yearly' : 'Monthly' }}</Label>
                </div>

            </div>

            <Separator class="my-4"></Separator>



            <TabsContent value="personal">
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    <PlansPlanCard @yearly-change="yearly = $event" :yearly="yearly" :data="plansArray[0]">
                    </PlansPlanCard>
                    <PlansPlanCard @yearly-change="yearly = $event" :yearly="yearly" :data="plansArray[1]">
                    </PlansPlanCard>
                    <PlansPlanCard @yearly-change="yearly = $event" :yearly="yearly" :data="plansArray[2]">
                    </PlansPlanCard>
                </div>
            </TabsContent>
            <TabsContent value="business">
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    <PlansPlanCard @yearly-change="yearly = $event" :yearly="yearly" :data="plansArray[3]">
                    </PlansPlanCard>
                    <PlansPlanCard @yearly-change="yearly = $event" :yearly="yearly" :data="plansArray[4]">
                    </PlansPlanCard>
                    <PlansPlanCard @yearly-change="yearly = $event" :yearly="yearly" :data="plansArray[5]">
                    </PlansPlanCard>
                </div>
            </TabsContent>
        </Tabs>

    </div>
</template>