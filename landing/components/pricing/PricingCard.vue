<script lang="ts" setup>

export type PricingCardProp = {
    title: string,
    cost: string,
    features: string[],
    desc: string,
    active: boolean
}

const props = defineProps<{ data: PricingCardProp }>();


function onUpgradeClick() {
    window.open('https://dashboard.litlyx.com')
}

</script>

<template>
    <div class="p-6 bg-[#303030] rounded-xl pricing-card flex flex-col">

        <div class="flex flex-col">
            <div class="text-[1.1rem] font-semibold mb-4">
                {{ data.title }}
            </div>
            <div class="flex gap-1 items-end mb-2">
                <div class="text-[1.1rem] font-semibold">
                    €{{ data.cost }}
                </div>
                <div class="text-text-sub text-[.9rem] mb-[.15rem]">
                    per month
                </div>
            </div>
            <div @click="onUpgradeClick()" v-if="data.active" class="cursor-pointer text-[1rem] font-semibold bg-[#3a3af5] rounded-md py-2 text-center">
                Start now for FREE
            </div>
            <div @click="onUpgradeClick()" v-if="!data.active" class="cursor-pointer text-[1rem] font-semibold bg-[#141414] rounded-md py-2 text-center">
                Go to Dashboard
            </div>
        </div>

        <div class="bg-gray-400 h-[1px] w-full my-4"></div>

        <div class="flex flex-col gap-1 grow">
            <div class="flex gap-2 items-center" v-for="feature of data.features">
                <i class="fas fa-check"></i>
                <div>
                    {{ feature }}
                </div>
            </div>

        </div>

        <div class="bg-gray-400 h-[1px] w-full my-4"></div>

        <div class="text-text-sub text-[.9rem] h-[20%]">
            {{ data.desc }}
        </div>
    </div>
</template>


<style scoped lang="scss">
.pricing-card * {
    font-family: "Poppins";
}
</style>