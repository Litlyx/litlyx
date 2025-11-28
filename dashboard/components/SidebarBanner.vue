<script lang="ts" setup>
import GradientBorder from '~/components/complex/GradientBorder.vue';

const { billingPeriodPercent, plan } = usePremiumStore()

const colorMode = useColorMode()
const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})

</script>

<template>
    <GradientBorder v-if="plan">

        <div class="flex items-center flex-col gap-2" v-if="plan.premium_type === 7006">
            <img :src="isDark ? '/flamy-white.png' : '/flamy-black.png'" class="w-[15%]">
            <div class="poppins font-semibold text-lg"> Free trial </div>
            <div class="flex flex-col gap-1">
                <Label class="poppins dark:text-white/80"> Your free trial ends in </Label>
                <div> <Progress :model-value="billingPeriodPercent"></Progress> </div>
                <div class="poppins text-sm dark:text-white/80 text-center">
                    {{ Math.floor((plan.end_at - Date.now()) / (1000 * 60 * 60 * 24)) }}
                    days </div>
            </div>
            <NuxtLink to="/plans" class="w-full mt-2">
                <Button size="sm" class="w-full"> Upgrade now </Button>
            </NuxtLink>
        </div>

        <div class="flex items-center flex-col gap-2" v-if="plan.premium_type === 0">
            <img :src="isDark ? '/flamy-white.png' : '/flamy-black.png'" class="w-[15%]">
            <div class="poppins font-semibold text-lg"> Free plan </div>
            <Label class="poppins dark:text-white/80"> Your are on a free plan </Label>
            <NuxtLink to="/plans" class="w-full mt-2">
                <Button size="sm" class="w-full"> Upgrade now </Button>
            </NuxtLink>
        </div>

        <div class="flex items-center flex-col gap-2" v-if="plan.payment_failed">
            <img :src="isDark ? '/flamy-white.png' : '/flamy-black.png'" class="w-[15%]">
            <div class="poppins font-semibold text-lg"> Payment Failed </div>
            <Label class="poppins dark:text-white/80 text-center">
                Please update your billing details to avoid service interruption.
            </Label>
            <NuxtLink to="/plans" class="w-full mt-2">
                <Button size="sm" class="w-full"> Update now </Button>
            </NuxtLink>
        </div>

        <div class="flex items-center flex-col gap-2" v-if="plan.canceled">
            <img :src="isDark ? '/flamy-white.png' : '/flamy-black.png'" class="w-[15%]">
            <div class="poppins font-semibold text-lg"> Plan canceled </div>
            <div class="flex flex-col gap-1">
                <Label class="poppins dark:text-white/80"> Your plan is still active for </Label>
                <div> <Progress :model-value="billingPeriodPercent"></Progress> </div>
                <div class="poppins text-sm dark:text-white/80 text-center">
                    {{ Math.floor((plan.end_at - Date.now()) / (1000 * 60 * 60 * 24)) }}
                    days </div>
            </div>
        </div>


    </GradientBorder>
</template>