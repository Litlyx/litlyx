<script setup lang="ts">

definePageMeta({ layout: 'none' });

const colorMode = useColorMode();

</script>


<template>

    <div
        class="w-full h-full flex flex-col items-center pt-[35vh] dark:bg-lyx-background bg-lyx-lightmode-background">

        <div>
            <img v-if="colorMode.value === 'dark'" class="w-[9rem]" :src="'logo-white.png'">
            <img v-if="colorMode.value === 'light'" class="w-[9rem]" :src="'logo-black.png'">
        </div>
        <div class="poppins text-[1.2rem] text-center font-semibold mt-10">
            Payment successful
        </div>
        <div class="mt-2 dark:text-lyx-text-dark text-lyx-lightmode-text-dark">
            Thanks for choosing Litlyx. You're ready to go!
        </div>
        <LyxUiButton type="primary" class="mt-10 py-2" to="/?just_logged=true">
            Go back to dashboard
        </LyxUiButton>

        <!-- <div class="flex items-center h-full flex-col gap-4"> -->


        <!-- <div class="poppins">
                We hope Litlyx can help you make better metrics-driven decision to help your business.
            </div>

            <NuxtLink to="/?just_logged=true"
                class="text-accent mt-10 bg-menu px-6 py-2 rounded-lg hover:bg-black font-semibold poppins cursor-pointer">
                Go back to dashboard
            </NuxtLink> -->

        <!-- </div> -->


    </div>

</template>
