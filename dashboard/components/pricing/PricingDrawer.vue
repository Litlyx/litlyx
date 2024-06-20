<script lang="ts" setup>
import type { PricingCardProp } from './PricingCard.vue';


const activeProject = useActiveProject();

const props = defineProps<{ currentSub: number }>();


const starterTierCardData = ref<PricingCardProp>({
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
    active: activeProject.value?.premium === false,
    isDowngrade: props.currentSub > 0,
    planId: 0
});

const accelerationTierCardData = ref<PricingCardProp>({
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
    active: activeProject.value?.premium_type === 1,
    isDowngrade: props.currentSub > 1,
    planId: 1
});

const expansionTierCardData = ref<PricingCardProp>({
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
    active: activeProject.value?.premium_type === 2,
    isDowngrade: props.currentSub > 2,
    planId: 2
});


const emits = defineEmits<{
    (evt: 'onCloseClick'): void
}>();

</script>

<template>
    <div class="p-8 overflow-y-auto xl:overflow-y-hidden">

        <div @click="$emit('onCloseClick')"
            class="cursor-pointer fixed top-4 right-4 rounded-full bg-menu drop-shadow-[0_0_2px_#CCCCCCCC] w-9 h-9 flex items-center justify-center">
            <i class="fas fa-close text-[1.6rem]"></i>
        </div>

        <div class="flex gap-8 mt-10 h-max xl:flex-row flex-col">
            <PricingCard class="flex-1" :data="starterTierCardData"></PricingCard>
            <PricingCard class="flex-1" :data="accelerationTierCardData"></PricingCard>
            <PricingCard class="flex-1" :data="expansionTierCardData"></PricingCard>
        </div>

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