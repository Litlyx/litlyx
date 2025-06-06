<script lang="ts" setup>
import type { PricingCardProp } from '../pricing/PricingCardGeneric.vue';


const { data: planData, refresh: refreshPlanData } = useFetch('/api/project/plan', {
    lazy: true, headers: useComputedHeaders({ useSnapshotDates: false })
});

function getPricingsData() {

    const freePricing: PricingCardProp[] = [
        {
            title: 'Free',
            price: '€0 / mo',
            subs: [
                'Up to 5000 visits/events per month',

            ],
            features: [
                'Email support',
                'Unlimited domains',
                'Unlimited reports',
                'AI Tokens: 10',
                'Server type: SHARED',
                'Data retention: 2 Months'
            ],
            cta: 'Start For Free now!',
            active: (planData.value?.premium_type || 0) == 0,
            isDowngrade: (planData.value?.premium_type || 0) > 0,
            planId: 0
        },
    ]

    const customPricing: PricingCardProp[] = [
        {
            title: 'Enterprise',
            price: 'Custom',
            subs: [
                'Unlimited visits/events per month',
                'Service Tailor-made on needs'
            ],
            features: [
                'Priority support',
                'Server type: DEDICATED',
                'DB instance: DEDICATED',
                'Dedicated operator',
                'White label',
                'Custom Data Aggregation'
            ],
            cta: 'Let\'s Talk!',
            link: 'mailto:help@litlyx.com',
            active: false,
            isDowngrade: false,
            planId: -1
        }
    ]

    const slidePricings: PricingCardProp[] = [
        {
            title: 'Incubation',
            price: '€4,99 / mo',
            subs: [
                'Up to 50.000 visits/events per month',
                '0,00010€ per visit/event'
            ],
            features: [
                'Slack support',
                'Unlimited domains',
                'Unlimited reports',
                'AI Tokens: 30',
                'Server type: SHARED',
                'Data retention: 6 Months'
            ],
            cta: 'Go to Cloud Dashboard',
            active: (planData.value?.premium_type || 0) == 101,
            isDowngrade: (planData.value?.premium_type || 0) > 101,
            planId: 101
        },
        {
            title: 'Acceleration',
            price: '€9,99 / mo',
            subs: [
                'Up to 150.000 visits/events per month',
                '0,00006€ per visit/event'
            ],
            features: [
                'Slack support',
                'Unlimited domains',
                'Unlimited reports',
                'AI Tokens: 100',
                'Server type: SHARED',
                'Data retention: 9 Months'
            ],
            cta: 'Go to Cloud Dashboard',
            active: (planData.value?.premium_type || 0) == 102,
            isDowngrade: (planData.value?.premium_type || 0) > 102,
            planId: 102
        },
        {
            title: 'Growth',
            price: '€29,99 / mo',
            subs: [
                'Up to 500.000 visits/events per month',
                '0,000059€ per visit/event'
            ],
            features: [
                'Slack support',
                'Unlimited domains',
                'Unlimited reports',
                'AI Tokens: 3.000',
                'Server type: SHARED',
                'Data retention: 1 Year'
            ],
            cta: 'Go to Cloud Dashboard',
            active: (planData.value?.premium_type || 0) == 103,
            isDowngrade: (planData.value?.premium_type || 0) > 103,
            planId: 103
        },
        {
            title: 'Expansion',
            price: '€59,99 / mo',
            subs: [
                'Up to 1.000.000 visits/events per month',
                '0,000059€ per visit/event'
            ],
            features: [
                'Slack support',
                'Unlimited domains',
                'Unlimited reports',
                'AI Tokens: 5.000',
                'Server type: SHARED',
                'Data retention: 3 Year'
            ],
            cta: 'Go to Cloud Dashboard',
            active: (planData.value?.premium_type || 0) == 104,
            isDowngrade: (planData.value?.premium_type || 0) > 104,
            planId: 104
        },
        {
            title: 'Scaling',
            price: '€99,99 / mo',
            subs: [
                'Up to 2.500.000 visits/events per month',
                '0,000039€ per visit/event'
            ],
            features: [
                'Slack support',
                'Unlimited domains',
                'Unlimited reports',
                'AI Tokens: 10.000',
                'Server type: DEDICATED',
                'Data retention: 7 Years'
            ],
            cta: 'Go to Cloud Dashboard',
            active: (planData.value?.premium_type || 0) == 105,
            isDowngrade: (planData.value?.premium_type || 0) > 105,
            planId: 105
        },
        {
            title: 'Unicorn',
            price: '€149,99 / mo',
            subs: [
                'Up to 5.000.000 visits/events per month',
                '0,000029€ per visit/event'
            ],
            features: [
                'Slack support',
                'Unlimited domains',
                'Unlimited reports',
                'AI Tokens: 20.000',
                'Server type: DEDICATED',
                'Data retention: 8 Years'
            ],
            cta: 'Go to Cloud Dashboard',
            active: (planData.value?.premium_type || 0) == 106,
            isDowngrade: (planData.value?.premium_type || 0) > 106,
            planId: 106
        }
    ]

    return { freePricing, customPricing, slidePricings }
}

</script>

<template>
    <div class="p-8 overflow-y-auto">

        <div class="flex gap-8 mt-10 h-max xl:flex-row flex-col">
            <PricingCardGeneric class="flex-1" :datas="getPricingsData().freePricing"></PricingCardGeneric>
            <PricingCardGeneric class="flex-1" :datas="getPricingsData().slidePricings" :default-index="2">
            </PricingCardGeneric>
            <PricingCardGeneric class="flex-1" :datas="getPricingsData().customPricing"></PricingCardGeneric>
        </div>

        <div class="flex justify-between items-center mt-10 flex-col xl:flex-row">
            <div class="flex flex-col gap-2">
                <div class="poppins text-[1.1rem] text-lyx-lightmode-text dark:text-yellow-400 mb-2">
                    *Plan upgrades are applicable exclusively to this project(workspace).
                </div>
                <div class="poppins text-[2rem] font-semibold">
                    Do you need help ?
                </div>
                <div class="poppins text-[1.2rem]">
                    We respond in max. 1-2 days
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <LyxUiButton type="secondary">
                    <a href="mailto:help@litlyx.com" class="poppins text-[1.1rem]">
                        help@litlyx.com
                    </a>
                </LyxUiButton>
                <LyxUiButton type="secondary">
                    <a href="https://discord.com/invite/9cQykjsmWX" class="poppins text-[1.1rem]">
                        Discord support
                    </a>
                </LyxUiButton>
            </div>
        </div>

    </div>
</template>