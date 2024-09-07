<script lang="ts" setup>
import type { PricingCardProp } from './PricingCardGeneric.vue';

const props = defineProps<{ currentSub: number }>();

const freePricing: PricingCardProp[] = [
    {
        title: 'Free',
        price: '€0 / mo',
        subs: [
            'Up to 5000 visits/events per month',
            'CPM 0€ per visit/event'
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
        active: props.currentSub == 0,
        isDowngrade: props.currentSub > 0,
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
            'CPM 0,10€ per visit/event'
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
        active: props.currentSub == 101,
        isDowngrade: props.currentSub > 101,
        planId: 101
    },
    {
        title: 'Acceleration',
        price: '€9,99 / mo',
        subs: [
            'Up to 150.000 visits/events per month',
            'CPM 0,06€ per visit/event'
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
        active: props.currentSub == 102,
        isDowngrade: props.currentSub > 102,
        planId: 102
    },
    {
        title: 'Growth',
        price: '€29,99 / mo',
        subs: [
            'Up to 500.000 visits/events per month',
            'CPM 0,059€ per visit/event'
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
        active: props.currentSub == 103,
        isDowngrade: props.currentSub > 103,
        planId: 103
    },
    {
        title: 'Expansion',
        price: '€59,99 / mo',
        subs: [
            'Up to 1.000.000 visits/events per month',
            'CPM 0,059€ per visit/event'
        ],
        features: [
            'Slack support',
            'Unlimited domains',
            'Unlimited reports',
            'AI Tokens: 5.000',
            'Server type: SHARED',
            'Data retention: 1 Year'
        ],
        cta: 'Go to Cloud Dashboard',
        active: props.currentSub == 104,
        isDowngrade: props.currentSub > 104,
        planId: 104
    },
    {
        title: 'Scaling',
        price: '€99,99 / mo',
        subs: [
            'Up to 2.500.000 visits/events per month',
            'CPM 0,039€ per visit/event'
        ],
        features: [
            'Slack support',
            'Unlimited domains',
            'Unlimited reports',
            'AI Tokens: 10.000',
            'Server type: DEDICATED',
            'Data retention: 2 Years'
        ],
        cta: 'Go to Cloud Dashboard',
        active: props.currentSub == 105,
        isDowngrade: props.currentSub > 105,
        planId: 105
    },
    {
        title: 'Unicorn',
        price: '€149,99 / mo',
        subs: [
            'Up to 5.000.000 visits/events per month',
            'CPM 0,029€ per visit/event'
        ],
        features: [
            'Slack support',
            'Unlimited domains',
            'Unlimited reports',
            'AI Tokens: 20.000',
            'Server type: DEDICATED',
            'Data retention: 3 Years'
        ],
        cta: 'Go to Cloud Dashboard',
        active: props.currentSub == 106,
        isDowngrade: props.currentSub > 106,
        planId: 106
    }
]


const emits = defineEmits<{
    (evt: 'onCloseClick'): void
}>();

const activeProject = useActiveProject()

async function onLifetimeUpgradeClick() {
    const res = await $fetch<string>(`/api/pay/${activeProject.value?._id.toString()}/create-onetime`, {
        ...signHeaders({ 'content-type': 'application/json' }),
        method: 'POST',
        body: JSON.stringify({ planId: 2001 })
    })
    if (!res) alert('Something went wrong');
    window.open(res);
}

</script>

<template>
    <div class="p-8 overflow-y-auto">

        <div @click="$emit('onCloseClick')"
            class="cursor-pointer fixed top-4 right-4 rounded-full bg-menu drop-shadow-[0_0_2px_#CCCCCCCC] w-9 h-9 flex items-center justify-center">
            <i class="fas fa-close text-[1.6rem]"></i>
        </div>

        <div class="flex gap-8 mt-10 h-max xl:flex-row flex-col">
            <PricingCardGeneric class="flex-1" :datas="freePricing"></PricingCardGeneric>
            <PricingCardGeneric class="flex-1" :datas="slidePricings" :default-index="2"></PricingCardGeneric>
            <PricingCardGeneric class="flex-1" :datas="customPricing"></PricingCardGeneric>
        </div>

        <LyxUiCard class="w-full mt-6">
            <div class="flex">
                <div class="flex flex-col gap-3">
                    <div>
                        <span class="text-lyx-primary font-semibold text-[1.4rem]">
                            LIFETIME DEAL
                        </span>
                        <span class="text-lyx-text-dark text-[.8rem]"> (Growth plan) </span>
                    </div>
                    <div class="text-[2rem]"> € 2.399,00 </div>
                    <div> Up to 500.000 visits/events per month </div>
                    <LyxUiButton type="primary" @click="onLifetimeUpgradeClick()"> Purchase </LyxUiButton>
                </div>
                <div class="flex justify-evenly grow">
                    <div class="flex flex-col justify-evenly">
                        <div class="flex items-center gap-2">
                            <img class="h-6" :src="'/check.png'" alt="Check">
                            <div> Slack support </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <img class="h-6" :src="'/check.png'" alt="Check">
                            <div> Unlimited domanis </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <img class="h-6" :src="'/check.png'" alt="Check">
                            <div> Unlimited reports </div>
                        </div>
                    </div>
                    <div class="flex flex-col justify-evenly">
                        <div class="flex items-center gap-2">
                            <img class="h-6" :src="'/check.png'" alt="Check">
                            <div> AI Tokens: 3.000 / month </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <img class="h-6" :src="'/check.png'" alt="Check">
                            <div> Server type: SHARED </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <img class="h-6" :src="'/check.png'" alt="Check">
                            <div> Data retention: 5 Years </div>
                        </div>
                    </div>
                </div>
            </div>
        </LyxUiCard>

        <div class="flex justify-between items-center mt-10 flex-col xl:flex-row">
            <div class="flex flex-col gap-2">
                <div class="poppins text-[2rem] font-semibold">
                    Do you need help ?
                </div>
                <div class="poppins text-[1.2rem] text-text/90">
                    We respond in max. 1-2 days
                </div>
            </div>
            <div class="mt-2">
                <div class="rounded-lg px-10 py-3 bg-[#303030]">
                    <a href="mailto:help@litlyx.com" class="poppins text-[1.3rem]">
                        help@litlyx.com
                    </a>
                </div>
            </div>
        </div>



    </div>
</template>