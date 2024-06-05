<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie';


const starterTierCardData = ref<any>({
    title: 'STARTER',
    cost: '0',
    features: [
        "3K visits/events per month",
        "10 AI Interaction per month",
        "1 month data retention",
        "Limited reports",
        "1 Team member",
        "Limited Automatic Email Report",
        "Shared Server & DB",
        "Low priority email support",
    ],
    desc: `Free project are not reliable and sometimes
           can experience some data loss.To have a 
           dedicated server we suggest to upgrade the
           plan to an higher one!`,
    active: true
});

const accelerationTierCardData = ref<any>({
    title: 'ACCELERATION',
    cost: '9,99',
    features: [
        "150K visits/events per month",
        "100 AI Interaction per month",
        "6 months data retention",
        "Limited reports",
        "1 Team member",
        "Limited Automatic Email Report",
        "Shared Server & DB",
        "Low priority email support"
    ],
    desc: `Your project is entering a growth phase. We simplify data analysis for you. For more support, try our Expansion plan—it's worth it!`,
    active: false
});

const expansionTierCardData = ref<any>({
    title: 'EXPANSION',
    cost: '39,99',
    features: [
        "500K visits/events per month",
        "5000 AI Interaction per month",
        "2 years data retention",
        "Unlimited reports",
        "10 Team member",
        "Unlimited Automatic Email Report",
        "Dedicated Server & DB",
        "high priority email support"
    ],
    desc: `We will support you with everything we can offer and give you the full power of our service. If you need more space and are growing, contact us for a custom offer!`,
    active: false
});

definePageMeta({ layout: 'header' });

</script>


<template>

    <div class="home h-full w-full min-h-[40dvh]">

        <div class="p-8">

            <div class="flex gap-8 h-max flex-col lg:flex-row">
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
            </div>

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
                    <a href="mailto:helplitlyx@gmail.com" class="poppins text-[1.3rem]">
                        helplitlyx@gmail.com
                    </a>
                </div>
            </div> -->
        </div>

        <!-- <Vue3Lottie height="16rem" animation-link="pricing_lottie.json"></Vue3Lottie>
        <div class="poppins text-[2rem] font-semibold text-center mt-6">
            Pricing coming soon
        </div> -->

    </div>

</template>
