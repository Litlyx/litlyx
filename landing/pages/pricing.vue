<script setup lang="ts">

import type { PricingCardProp } from '~/components/pricing/PricingCardGeneric.vue';


definePageMeta({ layout: 'header' });


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
        cta: 'Start For Free now!'
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
        link: 'mailto:help@litlyx.com'
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
        cta: 'Go to Cloud Dashboard'
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
        cta: 'Go to Cloud Dashboard'
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
        cta: 'Go to Cloud Dashboard'
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
        cta: 'Go to Cloud Dashboard'
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
        cta: 'Go to Cloud Dashboard'
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
        cta: 'Go to Cloud Dashboard'
    }
]



</script>


<template>

    <div class="home h-full w-full min-h-[40dvh]">

        <div class="text-center mt-8">
            <div class="poppins text-4xl mb-4 font-medium">
                Pricing
            </div>
            <div class="poppins text-2xl mb-4 font-normal text-white/80 px-8">
                Start for Free and scale as you go
            </div>
        </div>

        <div class="p-4">

            <div class="flex gap-12 h-max flex-col lg:flex-row justify-center">
                <PricingCardGeneric :datas="freePricing">
                </PricingCardGeneric>
                <PricingCardGeneric :datas="slidePricings">
                </PricingCardGeneric>
                <PricingCardGeneric :datas="customPricing">
                </PricingCardGeneric>
            </div>

            <div class="flex justify-center">
                <LyxUiCard class="w-full mt-6 max-w-[96rem]">
                    <div class="flex flex-col lg:flex-row">
                        <div class="flex flex-col gap-3">
                            <div>
                                <span class="text-lyx-primary font-semibold text-[1.4rem]">
                                    LIFETIME DEAL
                                </span>
                                <span class="text-lyx-text-dark text-[.8rem]"> (Growh plan) </span>
                            </div>
                            <div class="text-[2rem]"> € 2.399,00 </div>
                            <div> Up to 500.000 visits/events per month </div>
                            <LyxUiButton type="primary" link="https://dashboard.litlyx.com"> Start for free now </LyxUiButton>
                        </div>
                        <div class="flex justify-evenly grow flex-col gap-2 lg:gap-0 lg:flex-row mt-4 lg:mt-0">
                            <div class="flex flex-col justify-evenly gap-2 lg:gap-0">
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
                            <div class="flex flex-col justify-evenly gap-2 lg:gap-0">
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
                                    <div> Data retention: 1 Year </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </LyxUiCard>
            </div>

            <!-- <div class="flex gap-8 h-max flex-col lg:flex-row">
                <PricingCard class="flex-1" :data="starterTierCardData"></PricingCard>
                <PricingCard class="flex-1" :data="accelerationTierCardData"></PricingCard>
                <PricingCard class="flex-1" :data="expansionTierCardData"></PricingCard>
            </div>

            <div class="flex justify-between items-center md:flex-row flex-col mt-10">
                <div class="flex flex-col gap-2">
                    <div class="poppins text-[2rem] font-semibold">
                        Book a demo!
                    </div>
                    <div class="poppins text-[1.2rem] text-text/90">
                        Take a slot & talk with <span class="text-accent font-semibold "> Antonio | CEO at
                            Litlyx.</span>
                    </div>
                </div>
                <div class="w-full lg:w-fit flex justify-center mt-10">
                    <div class="bg-[#303030] rounded-lg py-4 w-full text-center lg:px-20">
                        <a href="https://cal.com/litlyx/15min" target="_blank" class="poppins text-[1.3rem]">
                            Schedule now!
                        </a>
                    </div>
                </div>
            </div> -->

            <!-- <div class="flex justify-between items-center mt-10">
                <div class="flex flex-col gap-2">
                    <div class="poppins text-[2rem] font-semibold">
                        Do you need help ?
                    </div>
                    <div class="poppins text-[1.2rem] text-text/90">
                        We respond in max. 1-2 days
                    </div>
                </div>
                <div class="py-4 px-20 bg-[#303030] rounded-lg">
                    <a href="mailto:help@litlyx.com" class="poppins text-[1.3rem]">
                        help@litlyx.com
                    </a>
                </div>
            </div> -->
        </div>


        <div class="px-8 mt-8 flex flex-col items-center">
            <div class="poppins text-4xl mb-4 font-medium">
                Frequently Asked Questions
            </div>
            <div class="w-full">
                <UAccordion :ui="{
                    wrapper: 'w-full',
                    item: {
                        padding: 'pl-8',
                    }
                }" color="white" variant="ghost" size="xl" :items="[
                    {
                        label: 'Is Litlyx free?',
                        content: 'We offer a free-forever plan with a 5k/mo limit and 2 months of data retention. We offer plans that grow with you.'
                    },
                    {
                        label: 'What does \'Data Retention\' mean?',
                        content: 'It is the duration your data is available in our database. After the data retention period expires, you will be notified via e-mail. You have 14 days to upgrade to a new plan. If not upgraded, we will start deleting data one day at a time to make space for new data.'
                    },
                    {
                        label: 'Can I export my data?',
                        content: 'Yes! We provide access to raw data, allowing you to download a CSV file and use your data as you wish. It’s always yours!'
                    },
                    {
                        label: 'Is the data collected privacy-focused?',
                        content: 'Yes! All data we collect is anonymous. We have our own tracking system. You can find more details in our Data Policy.'
                    },
                    {
                        label: 'Can I self-host Litlyx?',
                        content: 'Yes! You can self-host your own instance of Litlyx. More information is available on docs.'
                    },
                    {
                        label: 'Did this FAQ help you?',
                        content: 'If you have any more questions or need further clarification, please contact us at help@litlyx.com.'
                    }

                ]">
                </UAccordion>
            </div>
        </div>

    </div>

</template>
